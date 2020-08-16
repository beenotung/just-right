import { catchMain } from '@beenotung/tslib/node'
import { startServer } from './server'

catchMain(
  startServer({
    port: 8053,
  }),
)
