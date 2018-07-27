import rbac from '../rbacConfig.js';
import sessionConfig from '../sessionConfig';
import url from 'url';
var applicationMiddleware = (req, res, next) => {
  if (req.session._authenticated) {
    let role = req.session.role,
      page = req.originalUrl,
      params = page.indexOf("?") != -1 ? page : null;
    rbac
      .can(role, page, params)
      .then(result => {
        if (result) {
          // res.setHeader("Cache-Control", "no-cache","must-revalidate");
          if (req.originalUrl.indexOf('/history') != -1)
            req.originalUrl = "/history";
          next();
        } else {
          res.status(403).end();
        }
      })
      .catch(err => {
        res.status(500).end();
      });
  } else {
    res.redirect("/login");
  }
}

export default applicationMiddleware;