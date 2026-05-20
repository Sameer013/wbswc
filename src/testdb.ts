// src/test-db.ts
import mariadb from 'mariadb'

async function test() {
  const conn = await mariadb.createConnection({
    host: 'localhost',
    port: 3308,
    user: 'wmsuser',
    password: 'wmsuser',
    database: 'wbswc',
    connectTimeout: 10000
  })

  console.log('Connected!')
  const rows = await conn.query('SELECT 1 as val')

  console.log(rows)
  await conn.end()
}

test().catch(console.error)
