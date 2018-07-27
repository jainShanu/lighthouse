import sessionConfig from "../sessionConfig";
var logoutMiddleware =(req, res, next) => {
    if (req.session._authenticated === true) {
      var prev_sessionId = req.sessionID;
      req.session.regenerate(err => {
        if (err) throw err;
        else {
          sessionConfig.store.destroy(prev_sessionId, err => {
            if (err) throw err;
          });
          req.session._authenticated = false;
          res.redirect(200, "/login");
        }
      });
    } else {
      next();
    }
  }
  export default logoutMiddleware;