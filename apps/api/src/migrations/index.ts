import * as migration_20260306_122718_init from './20260306_122718_init';

export const migrations = [
  {
    up: migration_20260306_122718_init.up,
    down: migration_20260306_122718_init.down,
    name: '20260306_122718_init'
  },
];
