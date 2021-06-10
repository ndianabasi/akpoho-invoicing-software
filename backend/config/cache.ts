import { CacheConfig } from '@ioc:Adonis/Addons/Adonis5-Cache'

export default {
  recordTTL: 30, // record ttl in days,

  ttlUnits: 'days', // time units for ttl record

  currentCacheStorage: 'redis', // storages which used as default cache storage

  enabledCacheStorages: ['redis'], // storages which will be loaded

  cacheKeyPrefix: 'akpoho_data_cache_', // prefix for keys, which will be stored in cache storage

  enabledEvents: {
    'cache-record:read': false,
    'cache-record:written': false,
    'cache-record:missed': false,
    'cache-record:forgotten': false,
  },
} as CacheConfig
