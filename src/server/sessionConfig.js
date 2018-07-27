import session from "express-session";
const fileStore = require('session-file-store')(session);
const sessionConfig = {
    name: "session-cookie-id",
    secret: "my-cookie-secret",
    saveUninitialized: false,
    resave: false,
    store: new fileStore(),
    cookie: {}
  };
  export default sessionConfig;