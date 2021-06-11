'use strict'

import Redis from '@ioc:Adonis/Addons/Redis'

class CacheHelper {
  public async put(cacheKey: string, cacheValue: any) {
    if (typeof cacheValue !== 'string') {
      cacheValue = JSON.stringify(cacheValue)
    }

    await Redis.set(cacheKey, cacheValue)
  }

  public async tag(sets: Array<string>, cacheKey: string) {
    for (const set of sets) {
      await Redis.sadd(set, cacheKey)
    }
  }
}

export default new CacheHelper()
