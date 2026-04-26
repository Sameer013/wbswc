import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
})

export default pool
