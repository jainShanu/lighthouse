var authenticationMiddleware =  (req,res,next)=>{
    if (req.cookies && req.cookies.session-cookie-id && !req.session) {
        console.log(req.url, "cookie invalid");
        res.clearCookie("session-cookie-id");
        return res.redirect("/login");
      }
      // if session is not initialized
      if (typeof req.session._authenticated === "undefined") {
        console.log(req.url, "session not initialized");
        req.session._authenticated = false;
        req.session.role = null;
        req.session.username = null;
        next();
        return;
      }
      if (req.session._authenticated && req.originalUrl === "/login") {
        return res.status(403).redirect("/form");
      }
      next();
}

module.exports = authenticationMiddleware;