import { query } from '../db.js'

export async function getAllTeams() {
  const result = await query(`
    SELECT
      teams.id,
      teams.name,
      teams.slug,
      teams.approved,
      divisions.name AS division_name,
      seasons.name AS season_name
    FROM teams
    LEFT JOIN divisions ON teams.division_id = divisions.id
    LEFT JOIN seasons ON teams.season_id = seasons.id
    ORDER BY teams.name;
  `)

  return result.rows
}

export async function getTeamBySlug(slug) {
  const result = await query(`
    SELECT
      teams.id,
      teams.name,
      teams.slug,
      teams.approved,
      divisions.name AS division_name,
      seasons.name AS season_name
    FROM teams
    LEFT JOIN divisions ON teams.division_id = divisions.id
    LEFT JOIN seasons ON teams.season_id = seasons.id
    WHERE teams.slug = $1;
  `, [slug])

  return result.rows[0] || {}
}

export async function getTeamMembers(teamId) {
  const result = await query(`
    SELECT
      users.id,
      users.first_name,
      users.last_name,
      users.email
    FROM team_members
    JOIN users ON team_members.user_id = users.id
    WHERE team_members.team_id = $1
    ORDER BY users.last_name, users.first_name;
  `, [teamId])

  return result.rows
}