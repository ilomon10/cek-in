import * as migration_20260307_130609_init from './20260307_130609_init';

export const migrations = [
  {
    up: migration_20260307_130609_init.up,
    down: migration_20260307_130609_init.down,
    name: '20260307_130609_init'
  },
];
