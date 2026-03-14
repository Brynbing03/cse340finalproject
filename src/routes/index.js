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
    subtitle: "Fill out the form below to request a match."
  });
});

router.post("/matches/request", (req, res) => {
  const { division, teamA, teamB, matchDate } = req.body;

  res.render("pages/request-confirmation", {
    title: "Request Submitted",
    pageTitle: "Match Request Submitted",
    division,
    teamA,
    teamB,
    matchDate
  });
});

router.get("/teams/:id", (req, res) => {

    const teamId = req.params.id;
  
    res.render("pages/team", {
      title: "Team",
      pageTitle: `Team ${teamId}`,
      teamId
    });
  
  });
  

export default router;
