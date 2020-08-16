import { toRawGithubUrl } from '../src/blocklist'
import { loadConfig } from '../src/config'
import { knex } from '../src/database'

describe('BlockList TestSuit', () => {
  it('should convert github file url into raw url', function () {
    expect(
      toRawGithubUrl(
        'https://github.com/justdomains/blocklists/blob/master/lists/adguarddns-justdomains.txt',
      ),
    ).toEqual(
      'https://raw.githubusercontent.com/justdomains/blocklists/master/lists/adguarddns-justdomains.txt',
    )
  })
  it('should load configs', async function () {
    await loadConfig()
  })
  afterAll(() => knex.destroy())
})
