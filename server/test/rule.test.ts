import { loadConfig } from '../src/config'
import { knex } from '../src/database'
import { matchDnsRule } from '../src/rule'

describe('Rule TestSuit', function () {
  it('should allows non-exist domains', async function () {
    const { rules } = await loadConfig()
    const rule = matchDnsRule('does-not-exist.net', rules)
    expect(rule).not.toBeDefined()
  })
  afterAll(() => {
    knex.destroy()
  })
})
