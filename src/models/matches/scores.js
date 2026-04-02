import { query } from '../db.js'

export async function getAllOfficialMatches() {
  const result = await query(`
    SELECT
      m.id,
      m.status,
      m.location,
      m.scheduled_at,
      t1.name AS team_a,
      t2.name AS team_b
    FROM matches m
    JOIN teams t1 ON m.team_a_id = t1.id
    JOIN teams t2 ON m.team_b_id = t2.id
    ORDER BY m.id DESC;
  `)

  return result.rows
}

export async function getMatchById(matchId) {
  const result = await query(`
    SELECT
      m.id,
      m.team_a_id,
      m.team_b_id,
      m.status,
      m.location,
      m.scheduled_at,
      t1.name AS team_a,
      t2.name AS team_b
    FROM matches m
    JOIN teams t1 ON m.team_a_id = t1.id
    JOIN teams t2 ON m.team_b_id = t2.id
    WHERE m.id = $1;
  `, [matchId])

  return result.rows[0] || {}
}

export async function createScoreSubmission({
  matchId,
  teamAScore,
  teamBScore
}) {
  const result = await query(`
    INSERT INTO score_submissions (
      match_id,
      submitted_by,
      team_a_score,
      team_b_score,
      status
    )
    VALUES ($1, $2, $3, $4, 'pending')
    RETURNING *;
  `, [
    matchId,
    null,
    teamAScore,
    teamBScore
  ])

  await query(`
    UPDATE matches
    SET status = 'score_submitted'
    WHERE id = $1
  `, [matchId])

  return result.rows[0]
}

export async function getPendingScoreSubmissions() {
  const result = await query(`
    SELECT
      ss.id,
      ss.match_id,
      ss.team_a_score,
      ss.team_b_score,
      ss.status,
      t1.name AS team_a,
      t2.name AS team_b
    FROM score_submissions ss
    JOIN matches m ON ss.match_id = m.id
    JOIN teams t1 ON m.team_a_id = t1.id
    JOIN teams t2 ON m.team_b_id = t2.id
    WHERE ss.status = 'pending'
    ORDER BY ss.id DESC;
  `)

  return result.rows
}

export async function approveScoreSubmission(scoreSubmissionId) {
  const result = await query(`
    SELECT match_id
    FROM score_submissions
    WHERE id = $1
  `, [scoreSubmissionId])

  const submission = result.rows[0]

  if (!submission) return null

  await query(`
    UPDATE score_submissions
    SET status = 'approved'
    WHERE id = $1
  `, [scoreSubmissionId])

  await query(`
    UPDATE matches
    SET status = 'completed'
    WHERE id = $1
  `, [submission.match_id])

  return true
}

export async function rejectScoreSubmission(scoreSubmissionId) {
  const result = await query(`
    SELECT match_id
    FROM score_submissions
    WHERE id = $1
  `, [scoreSubmissionId])

  const submission = result.rows[0]

  if (!submission) return null

  await query(`
    UPDATE score_submissions
    SET status = 'rejected'
    WHERE id = $1
  `, [scoreSubmissionId])

  await query(`
    UPDATE matches
    SET status = 'scheduled'
    WHERE id = $1
  `, [submission.match_id])

  return true
}