#!/usr/bin/env python3
"""Interactive `init` tests. The picker needs a real terminal, so each case
runs the CLI under a pty and drives it with keystrokes.

    python3 test/init.test.py [registry-url]
"""
import os, pty, sys, time, select, json, shutil, tempfile, re, subprocess

REGISTRY = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3000/r'
CLI = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dist', 'index.js')
ROOT = tempfile.mkdtemp()
results = []

def run_init(cwd, keys, settle=8.0):
    """Drive `init` with a list of (delay, bytes) and return the raw output."""
    env = dict(os.environ, STEPWISE_REGISTRY_URL=REGISTRY,
               FORCE_COLOR='0', COLUMNS='110', LINES='30')
    pid, fd = pty.fork()
    if pid == 0:
        os.chdir(cwd)
        os.execvpe('node', ['node', CLI, 'init'], env)
    out = b''
    def pump(t):
        nonlocal out
        end = time.time() + t
        while time.time() < end:
            r, _, _ = select.select([fd], [], [], 0.1)
            if r:
                try: out += os.read(fd, 65536)
                except OSError: return
    pump(2.5)
    for delay, data in keys:
        os.write(fd, data); pump(delay)
    pump(settle)
    try: os.close(fd)
    except OSError: pass
    try: os.waitpid(pid, 0)
    except ChildProcessError: pass
    return out.decode(errors='replace')

def flat(s):
    """The pty renders one char per line mid-prompt; flatten for matching."""
    s = re.sub(r'\x1b\[[0-9;?]*[a-zA-Z]', '', s)
    return re.sub(r'[^A-Za-z]', '', s)

def project(name, tsconfig=None, css=None):
    d = os.path.join(ROOT, name)
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d)
    open(os.path.join(d, 'package.json'), 'w').write('{"name":"t","version":"1.0.0"}')
    if tsconfig is not None:
        open(os.path.join(d, 'tsconfig.json'), 'w').write(tsconfig)
    if css is not None:
        os.makedirs(os.path.join(d, 'app'), exist_ok=True)
        open(os.path.join(d, 'app', 'globals.css'), 'w').write(css)
    return d

def check(label, cond, detail=''):
    results.append(cond)
    print(f"  {'PASS' if cond else 'FAIL'} {label}" + (f"\n     {detail}" if not cond and detail else ''))

ALIAS = '{"compilerOptions":{"baseUrl":".","paths":{"@/*":["./*"]}}}'
TYPE  = [(1.0, b'kbd'), (0.6, b'\t'), (1.5, b'\r')]

print('\npicker')
d = project('pick', ALIAS)
out = run_init(d, TYPE)
check('filters and installs the selection', os.path.exists(f'{d}/components/stepwise/kbd.tsx'))
check('does not install anything else',   not os.path.exists(f'{d}/components/stepwise/button.tsx'))

print('\ncancel')
d = project('cancel', ALIAS)
out = run_init(d, [(1.0, b'\x03')], settle=2.0)   # ctrl-c
check('ctrl-c writes nothing', not os.path.exists(f'{d}/components'))

print('\nselecting nothing')
d = project('none', ALIAS)
out = run_init(d, [(1.5, b'\r')], settle=3.0)     # enter with no selection
check('empty selection installs nothing', not os.path.exists(f'{d}/components'))
check('says so', 'Nothingselected' in flat(out), flat(out)[-80:])

print('\nsetup offers')
NEXT = '{"compilerOptions":{"strict":true},"include":["next-env.d.ts","**/*.ts","**/*.tsx"]}'
d = project('setup', NEXT, '@import "tailwindcss";\n\nbody{margin:0}\n')
out = run_init(d, TYPE + [(1.2, b'\r'), (1.2, b'\r')])
cfg = json.load(open(f'{d}/tsconfig.json'))
css = open(f'{d}/app/globals.css').read()
check('adds the @/ alias',          cfg['compilerOptions']['paths']['@/*'] == ['./*'])
check('keeps existing options',     cfg['compilerOptions'].get('strict') is True)
check('keeps the include globs',    len(cfg.get('include', [])) == 3, str(cfg.get('include')))
check('adds the dark variant',      '@custom-variant dark' in css)
check('keeps the rest of the css',  'body{margin:0}' in css)
check('no comment warning here',    'dropitscomments' not in flat(out))

print('\ncommented tsconfig')
d = project('cmt', '{\n  // team defaults\n  "compilerOptions": {"strict": true}\n}\n', '@import "tailwindcss";\n')
out = run_init(d, TYPE + [(1.2, b'\r'), (1.2, b'n')], settle=6.0)
check('warns that comments will be dropped', 'dropitscomments' in flat(out))
check('declining leaves the file alone', '// team defaults' in open(f'{d}/tsconfig.json').read())

print('\nalready set up')
d = project('done', ALIAS, '@import "tailwindcss";\n@custom-variant dark (&:where(.dark, .dark *));\n')
out = run_init(d, TYPE, settle=8.0)
check('no setup prompts when nothing is missing', 'pathalias' not in flat(out) and 'darkmodevariant' not in flat(out))
check('still installs', os.path.exists(f'{d}/components/stepwise/kbd.tsx'))

print(f"\ntotal  {sum(results)} passed, {len(results)-sum(results)} failed")
shutil.rmtree(ROOT, ignore_errors=True)
sys.exit(0 if all(results) else 1)
