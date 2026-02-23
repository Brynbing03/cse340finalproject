import { Router } from "express";
import { divisions, teams, matches } from "../data/sampleData.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("pages/home", {
    title: "BYU-I Intramural Pickleball",
    subtitle: "Doubles only • Women • Men • Mixed"
  });
});

router.get("/divisions", (req, res) => {
  res.render("pages/divisions", {
    title: "Divisions",
    divisions
  });
});

router.get("/matches", (req, res) => {
  res.render("pages/matches", {
    title: "Matches",
    matches
  });
});

router.get("/matches/request", (req, res) => {
  res.render("pages/request-match", {
    title: "Request a Pickup Match",
    divisions,
    teams
  });
});

export default router;