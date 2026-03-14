import { Router } from "express";
import {
  buildHome,
  buildDivisions,
  buildMatches,
  buildRequestMatch,
  submitRequestMatch,
  buildTeamById
} from "../controllers/siteController.js";

const router = Router();

router.get("/", buildHome);
router.get("/divisions", buildDivisions);
router.get("/matches", buildMatches);
router.get("/matches/request", buildRequestMatch);
router.post("/matches/request", submitRequestMatch);
router.get("/teams/:id", buildTeamById);


// i have this so that i can test my 500 error page saying that it is a server error! it works yay

// router.get("/error-test", (req, res, next) => {
//     next(new Error("Test 500 error"));
//   });
  

export default router;
