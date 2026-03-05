import { prisma } from '@/libs/prisma'

const getdata = async () => {
  const data = await prisma.$queryRaw`SELECT * FROM users`

  return data
}

export default async function Page() {
  const users = await getdata()

  return (
    <>
      <h1>About page!</h1>
      <h2>Users from DB:</h2>
      {users.map(user => (
        <div key={user.id}>
          <p>
            {user.name} - {user.email}
          </p>
        </div>
      ))}
    </>
  )
}
