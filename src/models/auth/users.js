import { query } from '../db.js'

export async function findUserByEmail(email) {
  const result = await query(`
    SELECT *
    FROM users
    WHERE email = $1
  `, [email])

  return result.rows[0] || {}
}

export async function createUser({
  firstName,
  lastName,
  email,
  passwordHash,
  role = 'player',
  gender = null
}) {
  const result = await query(`
    INSERT INTO users (
      first_name,
      last_name,
      email,
      password_hash,
      role,
      gender
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, first_name, last_name, email, role;
  `, [firstName, lastName, email, passwordHash, role, gender])

  return result.rows[0]
}