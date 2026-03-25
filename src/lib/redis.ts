import { createClient } from 'redis'

type AppRedisClient = ReturnType<typeof createClient>

declare global {
  var __redisClient: AppRedisClient | undefined
  var __redisConnectPromise: Promise<AppRedisClient> | undefined
}

function createRedisClient() {
  const redisUrl = process.env.REDIS_URL

  if (!redisUrl) {
    throw new Error('REDIS_URL is not set')
  }

  const client = createClient({
    url: redisUrl,
  })

  client.on('error', (error) => {
    console.error('Redis client error', error)
  })

  return client
}

function getOrCreateRedisClient(): AppRedisClient {
  if (!globalThis.__redisClient) {
    globalThis.__redisClient = createRedisClient()
  }

  return globalThis.__redisClient
}

export async function getRedis(): Promise<AppRedisClient> {
  const client = getOrCreateRedisClient()

  if (client.isOpen) {
    return client
  }

  if (!globalThis.__redisConnectPromise) {
    globalThis.__redisConnectPromise = client
      .connect()
      .then(() => client)
      .finally(() => {
        globalThis.__redisConnectPromise = undefined
      })
  }

  const connectPromise = globalThis.__redisConnectPromise

  return connectPromise
}

export async function closeRedis() {
  if (!globalThis.__redisClient) {
    return
  }

  if (globalThis.__redisClient.isOpen) {
    await globalThis.__redisClient.quit()
  }

  globalThis.__redisClient = undefined
  globalThis.__redisConnectPromise = undefined
}

export async function pingRedis() {
  const client = await getRedis()
  return client.ping()
}
