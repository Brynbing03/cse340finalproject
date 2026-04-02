export default function baseData(req, res, next) {
  res.locals.currentYear = new Date().getFullYear();
  res.locals.loggedIn = !!req.session.user;
  res.locals.user = req.session.user || null;
  next();
}