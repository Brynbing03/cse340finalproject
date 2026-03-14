const siteData = (req, res, next) => {

    res.locals.siteName = "BYU-I Pickleball";
  
    next();
  
  };
  
  export default siteData;
  