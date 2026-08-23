'use client'

import { Table, type TableColumn } from '@/components/stepwise/table'
import { Chip, type ChipColor } from '@/components/stepwise/chip'

type User = { name: string; role: string; status: 'Active' | 'Invited' | 'Suspended' }

const USERS: User[] = [
  { name: 'Akhil Reji',    role: 'Admin',     status: 'Active'    },
  { name: 'Sarah Chen',    role: 'Editor',    status: 'Active'    },
  { name: 'Marcus Wright', role: 'Viewer',    status: 'Invited'   },
  { name: 'Priya Nair',    role: 'Editor',    status: 'Active'    },
  { name: 'Luka Moran',    role: 'Viewer',    status: 'Suspended' },
]

const MANY_USERS: User[] = [
  ...USERS,
  { name: 'Ines Duarte',   role: 'Editor', status: 'Active'    },
  { name: 'Tom Okafor',    role: 'Viewer', status: 'Active'    },
  { name: 'Mia Tanaka',    role: 'Admin',  status: 'Active'    },
  { name: 'Leo Fischer',   role: 'Viewer', status: 'Invited'   },
  { name: 'Zara Ahmed',    role: 'Editor', status: 'Active'    },
  { name: 'Ben Kowalski',  role: 'Viewer', status: 'Suspended' },
  { name: 'Ana Petrova',   role: 'Editor', status: 'Active'    },
]

const STATUS_COLOR: Record<string, ChipColor> = {
  Active:    'success',
  Invited:   'warning',
  Suspended: 'idle',
}

const COLS: TableColumn<User>[] = [
  { key: 'name',   header: 'Name',   width: '1fr' },
  { key: 'role',   header: 'Role',   width: '120px' },
  {
    key: 'status', header: 'Status', width: '120px',
    render: (v) => (
      <Chip size="sm" dot color={STATUS_COLOR[String(v)]}>
        {String(v)}
      </Chip>
    ),
  },
]

export function TablePreview() {
  return <Table columns={COLS} rows={USERS} getKey={r => r.name} />
}

export function TablePaginatedPreview() {
  return <Table columns={COLS} rows={MANY_USERS} getKey={r => r.name} pageSize={5} />
}
