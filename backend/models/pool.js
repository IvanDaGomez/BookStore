import { Pool } from 'pg'

export const pool = new Pool({
  user: process.env.POSTGRESQL_USERNAME,
  host: process.env.POSTGRESQL_HOST,
  database: process.env.POSTGRESQL_DATABASE,
  password: process.env.POSTGRESQL_PASSWORD,
  port: process.env.POSTGRESQL_PORT,
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 second
  connectionTimeoutMillis: 2000 // return an error after 2 seconds if connection could not be established
})
