import { getAllTeams, getTeamBySlug, getTeamMembers } from '../../models/teams/teams.js'

export async function teamListPage(req, res, next) {
  try {
    const teams = await getAllTeams()

    res.render('pages/teams/list', {
      title: 'Teams',
      pageTitle: 'Teams',
      teams,
    })
  } catch (error) {
    next(error)
  }
}

export async function teamDetailPage(req, res, next) {
  try {
    const teamSlug = req.params.slug
    const team = await getTeamBySlug(teamSlug)

    if (Object.keys(team).length === 0) {
      const err = new Error(`Team ${teamSlug} not found`)
      err.status = 404
      return next(err)
    }

    const members = await getTeamMembers(team.id)

    res.render('pages/teams/detail', {
      title: team.name,
      pageTitle: team.name,
      team,
      members,
    })
  } catch (error) {
    next(error)
  }
}