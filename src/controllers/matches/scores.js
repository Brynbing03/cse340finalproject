import {
    getAllOfficialMatches,
    getMatchById,
    createScoreSubmission,
    getPendingScoreSubmissions,
    approveScoreSubmission,
    rejectScoreSubmission
  } from '../../models/matches/scores.js'
  
  export async function buildSubmitScoreListPage(req, res, next) {
    try {
      const matches = await getAllOfficialMatches()
  
      res.render('pages/matches/submit-score-list', {
        title: 'Submit Score',
        pageTitle: 'Submit a Score',
        matches
      })
    } catch (error) {
      next(error)
    }
  }
  
  export async function buildSubmitScorePage(req, res, next) {
    try {
      const match = await getMatchById(req.params.id)
  
      if (Object.keys(match).length === 0) {
        const err = new Error('Match not found')
        err.status = 404
        return next(err)
      }
  
      res.render('pages/matches/submit-score', {
        title: 'Submit Score',
        pageTitle: 'Submit Score',
        match
      })
    } catch (error) {
      next(error)
    }
  }
  
  export async function submitScore(req, res, next) {
    try {
      const { teamAScore, teamBScore } = req.body
  
      await createScoreSubmission({
        matchId: req.params.id,
        teamAScore,
        teamBScore
      })
  
      res.redirect('/admin/scores')
    } catch (error) {
      next(error)
    }
  }
  
  export async function buildAdminScoresPage(req, res, next) {
    try {
      const submissions = await getPendingScoreSubmissions()
  
      res.render('pages/admin/scores', {
        title: 'Approve Scores',
        pageTitle: 'Pending Score Submissions',
        submissions
      })
    } catch (error) {
      next(error)
    }
  }
  
  export async function approveScore(req, res, next) {
    try {
      await approveScoreSubmission(req.params.id)
      res.redirect('/admin/scores')
    } catch (error) {
      next(error)
    }
  }
  
  export async function rejectScore(req, res, next) {
    try {
      await rejectScoreSubmission(req.params.id)
      res.redirect('/admin/scores')
    } catch (error) {
      next(error)
    }
  }