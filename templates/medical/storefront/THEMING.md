# Theming

## The problem

The Stepwise components this template vendors are **zinc-based** — `text-zinc-700`,
`bg-zinc-50`, `border-zinc-200` throughout. Zinc is a cool neutral grey. The art
direction calls for warm cream paper and deep navy ink. Dropping those components
onto a cream page unedited would put grey buttons and grey borders on warm paper,
which reads as a mistake rather than a palette.

The obvious fix — rewrite every `zinc-*` class across 13 components — is a large diff
that has to be redone every time a component is re-vendored from the library.

## What we did instead

**Redefined the zinc scale itself**, once, in `app/globals.css`:

```css
@theme {
  --color-zinc-50:  oklch(0.980 0.010 85);   /* warm      */
  --color-zinc-100: oklch(0.958 0.015 84);
  ...
  --color-zinc-700: oklch(0.345 0.040 250);  /* turns navy */
  --color-zinc-900: oklch(0.205 0.046 255);
  --color-zinc-950: oklch(0.152 0.036 257);
}
```

Lightness follows the normal zinc ramp, but **hue interpolates from 85° at the light
end to 256° at the dark end**. Light steps are warm paper; dark steps are navy ink;
the mid steps pass through warm stone. Nothing is a neutral grey at any point.

The consequence: a vendored component saying `text-zinc-700` renders navy, and
`bg-zinc-50` renders cream, **with no edit to the component**. Re-vendoring a
component from the library picks up the palette automatically.

> If you re-run `npx stepwise-ui add <component>`, it will just work. That is the
> whole point of doing it this way.

## The four token layers

| Layer | Prefix | Purpose |
|---|---|---|
| Tailwind scale | `--color-zinc-*` | Overridden as above; makes vendored components warm |
| Named inks | `--color-paper`, `--color-ink`, `--color-cobalt`, `--color-teal`, `--color-green`, `--color-coral`, `--color-lavender` | The seven-colour core palette, addressable as `bg-cobalt`, `text-ink` etc. for art that isn't going through zinc |
| Page surfaces | `--background`, `--foreground`, `--surface-raised`, `--surface-sunken` | Page and card grounds |
| Component chrome | `--ui-border`, `--ui-border-subtle`, `--ui-border-focus`, `--ui-border-open`, `--ui-border-error` | Squircle borders. The library's components expect exactly these names |
| Illustration inks | `--plate-bg`, `--plate-cream`, `--plate-stone`, `--plate-ink`, `--plate-cobalt`, `--plate-teal`, `--plate-green`, `--plate-coral`, `--plate-lavender` | Used only by `components/riso/` |

Everything is OKLCH, so lightness and chroma stay perceptually even across the ramp
in a way hex values wouldn't.

## Dark mode

Class-based, via `@custom-variant dark (&:where(.dark, .dark *))` — matching the
component library. `html.dark` redefines every token above; no component carries a
hardcoded dark colour.

A blocking script in `app/layout.tsx` sets the class before React hydrates, so the
page never paints light and then flips. **Light is the default here**, unlike the
library it was vendored from, which is dark-first.

Dark mode is not an inversion. Paper becomes a deep navy ground rather than black,
and the illustration inks lighten (`--plate-cream` gets darker, `--plate-stone`
shifts to a navy-tinted mid) so the plates keep their internal contrast instead of
becoming flat silhouettes.

## Borders — read this before styling anything round

Every element with a corner radius uses `@lisse/react` squircle smoothing at
`0.6`. **A CSS `border` on a squircle element is invisible** — the `clip-path` sits
exactly on the border and anti-aliases it away.

Always use the SVG overlay instead:

```tsx
<Surface
  radius={22}
  lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
  className="..."   // no border-* or rounded-* classes here
>
```

`middleBorder` (straddling the clip boundary) is the correct default — not
`innerBorder` or `outerBorder`.

The one accepted exception is a border colour that animates per-frame on interactive
state (the text input's focus ring), which uses a plain CSS border on a separate
absolutely-positioned sibling so `transition: border-color` works. That's deliberate.

## Contrast

Two rules that came out of actual measurement, not taste:

1. **Text on a filled colour panel does not get a third opacity tier.** On a
   mid-luminance fill, the minimum ink opacity that still clears 4.5:1 is 82% for the
   coral and 73% for the botanical green. A "faint" tier below that fails. Hierarchy
   is carried by size and position instead. See the comment block in
   `components/site/offer-card.tsx` for the measured numbers per tone.
2. **Coral takes navy ink, not white.** White on coral is ~2.6:1 and fails at every
   size; navy on the same coral is 5.8:1. Cobalt and green are dark enough for white.

If you change a fill colour, re-measure — don't assume the tints still pass.

## Changing the palette

Edit the token blocks in `app/globals.css`. Both the `:root` and `html.dark` blocks,
or dark mode drifts. Nothing else in the codebase hardcodes a colour except the
`TONE` table in `offer-card.tsx`, which is deliberately fixed against its own fills.
