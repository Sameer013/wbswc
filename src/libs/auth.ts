import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import bcrypt from 'bcryptjs'

import { prisma } from '@/libs/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {}
      },

      async authorize(credentials) {
        // console.log('Credentials:', credentials)

        if (!credentials?.email || !credentials?.password) {
          // console.log('Missing Credetials')

          return null
        }

        const user = await prisma.users.findUnique({
          where: {
            email: credentials.email
          }
        })

        console.log('User fetched:', user)
        if (!user || !user.password) return null

        // console.log('DB password', user.password)
        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) return null

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name ?? '',
          role_id: user.role_id ?? null
        }
      }
    })
  ],

  session: {
    strategy: 'jwt'
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role_id = (user as any).role_id
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role_id = token.role_id
      }

      return session
    }
  },

  pages: {
    signIn: '/login'
  },

  secret: process.env.NEXTAUTH_SECRET
}
