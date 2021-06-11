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

  public async flushKey(cacheKeys: string | Array<string>) {
    const keys = Array.isArray(cacheKeys) ? cacheKeys.join(',') : cacheKeys
    await Redis.del(keys)
  }

  public async flushTag(setKey: string) {
    await Redis.smembers(setKey).then((cacheKeys) => {
      this.flushKey(cacheKeys)
    })
  }

  public async flushTags(setKeys: string[]) {
    for (const key of setKeys) {
      await this.flushTag(key)
    }
  }

  public async nukeTags(setKeys: string[]) {
    for (const key of setKeys) {
      await this.flushTag(key)
    }

    await Redis.del(setKeys)
  }
}

export default new CacheHelper()
