import { Router } from "express";
import {
  buildHome,
  buildDivisions
} from "../controllers/siteController.js";

import { teamListPage, teamDetailPage } from '../controllers/teams/teams.js'

import {
  requestMatchForm,
  submitMatchRequest,
  adminMatchRequests,
  approveRequest,
  rejectRequest,
  buildMatchesPage
} from '../controllers/matches/requests.js'

import {
  buildSubmitScoreListPage,
  buildSubmitScorePage,
  submitScore,
  buildAdminScoresPage,
  approveScore,
  rejectScore
} from '../controllers/matches/scores.js'

import {
  buildRegister,
  buildLogin,
  registerUser,
  loginUser,
  logoutUser
} from '../controllers/auth/auth.js'

import { requireAdmin } from '../middleware/auth.js'

const router = Router();

router.get("/", buildHome);
router.get("/divisions", buildDivisions);

router.get('/register', buildRegister)
router.post('/register', registerUser)

router.get('/login', buildLogin)
router.post('/login', loginUser)
router.post('/logout', logoutUser)

router.get('/teams', teamListPage)
router.get('/teams/:slug', teamDetailPage)

router.get('/matches', buildMatchesPage)

router.get('/matches/request', requestMatchForm)
router.post('/matches/request', submitMatchRequest)

router.get('/matches/submit-score', buildSubmitScoreListPage)
router.get('/matches/:id/submit-score', buildSubmitScorePage)
router.post('/matches/:id/submit-score', submitScore)

router.get('/admin/match-requests', requireAdmin, adminMatchRequests)
router.post('/admin/match-requests/:id/approve', requireAdmin, approveRequest)
router.post('/admin/match-requests/:id/reject', requireAdmin, rejectRequest)

router.get('/admin/scores', requireAdmin, buildAdminScoresPage)
router.post('/admin/scores/:id/approve', requireAdmin, approveScore)
router.post('/admin/scores/:id/reject', requireAdmin, rejectScore)

export default router;