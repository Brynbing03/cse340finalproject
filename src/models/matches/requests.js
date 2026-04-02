import { query } from '../db.js'

export async function getAllTeamsForDropdown() {
  const result = await query(`
    SELECT
      teams.id,
      teams.name,
      teams.slug,
      divisions.name AS division_name,
      seasons.name AS season_name
    FROM teams
    LEFT JOIN divisions ON teams.division_id = divisions.id
    LEFT JOIN seasons ON teams.season_id = seasons.id
    WHERE teams.approved = true
    ORDER BY teams.name;
  `)

  return result.rows
}

export async function createMatchRequest({
  requestingTeamId,
  opponentTeamId,
  requestedDate,
  requestedTime,
  location
}) {
  const teamInfo = await query(`
    SELECT division_id, season_id, created_by
    FROM teams
    WHERE id = $1
  `, [requestingTeamId])

  const team = teamInfo.rows[0]

  const result = await query(`
    INSERT INTO match_requests (
      requesting_team_id,
      opponent_team_id,
      requested_by,
      season_id,
      division_id,
      requested_date,
      requested_time,
      location,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'requested')
    RETURNING *;
  `, [
    requestingTeamId,
    opponentTeamId,
    team?.created_by || null,
    team?.season_id || null,
    team?.division_id || null,
    requestedDate,
    requestedTime,
    location
  ])

  return result.rows[0]
}

export async function getPendingMatchRequests() {
  const result = await query(`
    SELECT
      mr.id,
      mr.requesting_team_id,
      mr.opponent_team_id,
      mr.season_id,
      mr.division_id,
      mr.requested_date,
      mr.requested_time,
      mr.location,
      mr.status,
      t1.name AS requesting_team,
      t2.name AS opponent_team
    FROM match_requests mr
    JOIN teams t1 ON mr.requesting_team_id = t1.id
    JOIN teams t2 ON mr.opponent_team_id = t2.id
    WHERE mr.status = 'requested'
    ORDER BY mr.created_at DESC;
  `)

  return result.rows
}

export async function approveMatchRequest(requestId) {
  const requestResult = await query(`
    SELECT *
    FROM match_requests
    WHERE id = $1
  `, [requestId])

  const request = requestResult.rows[0]

  if (!request) return null

  const scheduledAt = request.requested_date && request.requested_time
    ? `${request.requested_date.toISOString().split('T')[0]} ${request.requested_time}`
    : null

  await query(`
    INSERT INTO matches (
      match_request_id,
      team_a_id,
      team_b_id,
      season_id,
      division_id,
      scheduled_at,
      location,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, 'scheduled')
  `, [
    request.id,
    request.requesting_team_id,
    request.opponent_team_id,
    request.season_id,
    request.division_id,
    scheduledAt,
    request.location
  ])

  await query(`
    UPDATE match_requests
    SET status = 'approved'
    WHERE id = $1
  `, [requestId])

  return true
}

export async function rejectMatchRequest(requestId) {
  await query(`
    UPDATE match_requests
    SET status = 'rejected'
    WHERE id = $1
  `, [requestId])

  return true
}

export async function getAllMatches() {
  const result = await query(`
    SELECT
      m.id,
      m.scheduled_at,
      m.location,
      m.status,
      t1.name AS team_a,
      t2.name AS team_b
    FROM matches m
    JOIN teams t1 ON m.team_a_id = t1.id
    JOIN teams t2 ON m.team_b_id = t2.id
    ORDER BY m.scheduled_at NULLS LAST, m.id DESC;
  `)

  return result.rows
}