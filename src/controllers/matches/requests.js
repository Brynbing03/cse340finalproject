import {
    getAllTeamsForDropdown,
    createMatchRequest,
    getPendingMatchRequests,
    approveMatchRequest,
    rejectMatchRequest,
    getAllMatches
  } from '../../models/matches/requests.js'
  
  export async function requestMatchForm(req, res, next) {
    try {
      const teams = await getAllTeamsForDropdown()
  
      res.render('pages/matches/request', {
        title: 'Request Match',
        pageTitle: 'Request a Match',
        teams
      })
    } catch (error) {
      next(error)
    }
  }
  
  export async function submitMatchRequest(req, res, next) {
    try {
      const {
        requestingTeamId,
        opponentTeamId,
        requestedDate,
        requestedTime,
        location
      } = req.body
  
      if (requestingTeamId === opponentTeamId) {
        const err = new Error('A team cannot play itself.')
        err.status = 400
        return next(err)
      }
  
      await createMatchRequest({
        requestingTeamId,
        opponentTeamId,
        requestedDate,
        requestedTime,
        location
      })
  
      res.redirect('/admin/match-requests')
    } catch (error) {
      next(error)
    }
  }
  
  export async function adminMatchRequests(req, res, next) {
    try {
      const requests = await getPendingMatchRequests()
  
      res.render('pages/admin/match-requests', {
        title: 'Match Requests',
        pageTitle: 'Pending Match Requests',
        requests
      })
    } catch (error) {
      next(error)
    }
  }
  
  export async function approveRequest(req, res, next) {
    try {
      await approveMatchRequest(req.params.id)
      res.redirect('/admin/match-requests')
    } catch (error) {
      next(error)
    }
  }
  
  export async function rejectRequest(req, res, next) {
    try {
      await rejectMatchRequest(req.params.id)
      res.redirect('/admin/match-requests')
    } catch (error) {
      next(error)
    }
  }
  
  export async function buildMatchesPage(req, res, next) {
    try {
      const matches = await getAllMatches()
  
      res.render('pages/matches/list', {
        title: 'Matches',
        pageTitle: 'Official Matches',
        matches
      })
    } catch (error) {
      next(error)
    }
  }