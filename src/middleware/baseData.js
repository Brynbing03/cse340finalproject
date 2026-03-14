const baseData = (req, res, next) => {
    res.locals.siteName = "BYU-I Pickleball";
    res.locals.currentYear = new Date().getFullYear();
    next();
  };
  
  export default baseData;
  