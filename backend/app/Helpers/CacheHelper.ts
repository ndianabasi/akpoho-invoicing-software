'use strict'

import Redis from '@ioc:Adonis/Addons/Redis'

class CacheHelper {
  public async get(cacheKey: string): Promise<any | null> {
    const cachedData = await Redis.get(cacheKey)
    return cachedData ? JSON.parse(cachedData) : null
  }

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
    if (Array.isArray(cacheKeys)) {
      await Redis.del(cacheKeys)
    } else await Redis.del(cacheKeys)
  }

  public async flushTag(setKey: string) {
    await Redis.smembers(setKey).then((cacheKeys) => {
      if (cacheKeys && !!cacheKeys.length) {
        this.flushKey(cacheKeys)
      }
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
