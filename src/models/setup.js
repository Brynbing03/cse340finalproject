import { query } from './db.js'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function setupDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS divisions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(120) UNIQUE NOT NULL
    );
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS seasons (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(120) UNIQUE NOT NULL,
      is_active BOOLEAN DEFAULT true
    );
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'player',
      gender VARCHAR(10),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS teams (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(120) UNIQUE NOT NULL,
      division_id INTEGER REFERENCES divisions(id) ON DELETE SET NULL,
      season_id INTEGER REFERENCES seasons(id) ON DELETE SET NULL,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      approved BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS team_members (
      id SERIAL PRIMARY KEY,
      team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(team_id, user_id)
    );
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS match_requests (
      id SERIAL PRIMARY KEY,
      requesting_team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      opponent_team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      requested_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      season_id INTEGER REFERENCES seasons(id) ON DELETE SET NULL,
      division_id INTEGER REFERENCES divisions(id) ON DELETE SET NULL,
      requested_date DATE,
      requested_time VARCHAR(50),
      location VARCHAR(150),
      status VARCHAR(20) NOT NULL DEFAULT 'requested',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS matches (
      id SERIAL PRIMARY KEY,
      match_request_id INTEGER REFERENCES match_requests(id) ON DELETE SET NULL,
      team_a_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      team_b_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      season_id INTEGER REFERENCES seasons(id) ON DELETE SET NULL,
      division_id INTEGER REFERENCES divisions(id) ON DELETE SET NULL,
      scheduled_at TIMESTAMP,
      location VARCHAR(150),
      status VARCHAR(20) NOT NULL DEFAULT 'scheduled'
    );
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS score_submissions (
      id SERIAL PRIMARY KEY,
      match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
      submitted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      team_a_score INTEGER NOT NULL,
      team_b_score INTEGER NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)

  const seedPath = path.join(__dirname, './sql/seed.sql')
  const seedSql = await fs.readFile(seedPath, 'utf8')
  await query(seedSql)
}

export async function testConnection() {
  const result = await query('SELECT NOW() as current_time')
  console.log('Database connection successful:', result.rows[0].current_time)
}