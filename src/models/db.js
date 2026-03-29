import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { Pool } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const certPath = path.join(__dirname, '../../bin/byuicse-psql-cert.pem')
const sslCert = fs.readFileSync(certPath, 'utf8')

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    ca: sslCert,
    rejectUnauthorized: true,
  },
})

export async function query(text, params = []) {
  const start = Date.now()

  try {
    const result = await pool.query(text, params)

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log('Executed query:', {
        text,
        duration: `${Date.now() - start}ms`,
        rows: result.rowCount,
      })
    }

    return result
  } catch (error) {
    console.error('Error in query:', {
      text,
      error: error.message,
    })
    throw error
  }
}

export { pool }