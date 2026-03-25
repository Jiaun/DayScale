import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { prisma } from '@/db'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
  advanced: {
    database: {
      generateId: 'serial',
    },
  },
  user: {
    modelName: 'sysUser',
    fields: {
      name: 'username',
      image: 'avatarUrl',
      emailVerified: 'emailVerified',
    },
  },
  session: {
    modelName: 'session',
  },
  account: {
    modelName: 'account',
  },
  verification: {
    modelName: 'verification',
  },
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    account: {
      create: {
        after: async (account) => {
          if (!account || account.providerId !== 'credential' || !account.password) {
            return
          }

          await prisma.sysUser.update({
            where: {
              id: BigInt(account.userId),
            },
            data: {
              passwordHash: account.password,
            },
          })
        },
      },
      update: {
        after: async (account) => {
          if (!account || account.providerId !== 'credential' || !account.password) {
            return
          }

          await prisma.sysUser.update({
            where: {
              id: BigInt(account.userId),
            },
            data: {
              passwordHash: account.password,
            },
          })
        },
      },
    },
  },
  plugins: [tanstackStartCookies()],
})
