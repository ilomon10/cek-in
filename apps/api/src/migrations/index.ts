import * as migration_20260105_010048 from './20260105_010048'

export const migrations = [
  {
    up: migration_20260105_010048.up,
    down: migration_20260105_010048.down,
    name: '20260105_010048',
  },
]
