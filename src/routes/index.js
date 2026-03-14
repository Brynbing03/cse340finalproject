import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("pages/home", {
    title: "Home",
    pageTitle: "BYU-I Intramural Pickleball",
    subtitle: "Doubles only • Women • Men • Mixed"
  });
});

router.get("/divisions", (req, res) => {
  res.render("pages/divisions", {
    title: "Divisions",
    pageTitle: "Divisions",
    subtitle: "Choose a division to view teams, matches, and standings later."
  });
});

router.get("/matches", (req, res) => {
  res.render("pages/matches", {
    title: "Matches",
    pageTitle: "Matches",
    subtitle: "These are sample match cards for now. Real data will come later."
  });
});

router.get("/matches/request", (req, res) => {
  res.render("pages/request-match", {
    title: "Request Match",
    pageTitle: "Request a Pickup Match",
    subtitle: "Later this form will save a new pickup match request to the database."
  });
});

export default router;
