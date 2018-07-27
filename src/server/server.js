"use strict"
const express = require("express"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  validator = require("express-validator"),
  path = require("path"),
  session = require('express-session');

import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import cors from 'cors';

import App from "../components/App";
import routes from "../routes.js";
import db from "./db/dbConfig";
import Error404 from '../components/Error404.jsx';
import jwtToken from './jwt-generator'
import Axios from "axios";
// app.use(require("morgan"));
//express static folder
import authenticationMiddleware from './middlewares/authentication';
import { ok, rejects } from "assert";
import { request } from "http";
import { resolve } from "path";

const app = express();
//app.use(cors());

//setting headers to not cache,store the pages// 
import setHeaders from './middlewares/setHeaders'
app.use("/*", setHeaders);

app.use(express.static(path.join(__dirname, "public")));
//body parser to parse post request content
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// set view engine and path to ejs file
app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

import sessionConfig from './sessionConfig';
app.use(session(sessionConfig));

// this middleware will ignore request 'favicon.ico' and can redirect request '/' to 'login'
app.use(["/", "/favicon.ico"], function (req, res, next) {
  if (req.originalUrl == "/favicon.ico") {
    res.end();
    return;
  }

  if (req.originalUrl == "/") {
    res.redirect("/login");
    return;
  }
  next();
});
app.use("/*", authenticationMiddleware);
//this middleware redirect clients to dashboard if they already have loggedin

import applicationMiddleware from './middlewares/rbacMiddlewares.js';
app.use(
  ["/dashboard", "/notifications", "/form", "form/dispatchDetails", "/history", "/api/company"],
  applicationMiddleware
);

//logout request handled by this middleware
import logoutMiddleware from "./middlewares/logoutMiddleware";
app.use("/logout", logoutMiddleware);

import { loginRequestHandler } from "./db/dbRequestHandler"

app.post('/login/user', loginRequestHandler);

// app.get('/api/data',(req,res)=>{
//   res.json({ name: "srt", work: true });
// })

import { saveFormData } from "./db/dbRequestHandler";

app.post("/form/dispatchDetails", vaildateFormData);
function saveForm(formData) {
  return new Promise((resolve, reject) => {
    saveFormData(formData, (error) => {
      if (error)
        reject(error);
      resolve();
    })
  })
}
function vaildateFormData(req, res) {
  // vaidate date from the current system date
  var date = req.body.dateDispatched,
    missingInventory = req.body.missingInventory,
    totalInventory = req.body.startStart - req.body.serialEnd;
  var timeDiff = Math.abs(new Date(date).getTime() - new Date().getTime());
  var diff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  if (Math.abs(diff) > 30 || totalInventory < missingInventory) {
    res.status(400).send("Enter valid form data");
  } else {
    // form = req.body;
    req.body.hasValidated = false;
    req.body.dispatchedBy = req.session.user;
    var formData = req.body;
    saveForm(formData)
      .then(() => {
        res.status(201).send({message:"Form saved successfully"});
      })
      .catch((error) => {
        res.status(500).send("internal server error occured. Try again.");
      })
  }
};

import { HistoryRequestHandler } from "./db/dbRequestHandler";
function historyRequest(role, username) {
  return new Promise((resolve, reject) => {
    HistoryRequestHandler(role, username, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    })
  });
}

app.use("/history", (req, res, next) => {
  let role = req.session.role,
    username = req.session.user,
    responseObj = { data: null };
  //async function call to historyRequestHandler and get responseObj 
  historyRequest(role, username)
    .then((result) => {
      // responseObj.success = true;
      // responseObj.message = result;
      responseObj.data = result;
      req.resMessage = responseObj;
      next();
    })
    .catch((err) => {
      responseObj.message = err;
      res.status(500).send("Internal server error occured.")
    })
});

import { getNotificationCount } from './db/dbRequestHandler';
function NotificationCount(){
  return new Promise((resolve,reject)=>{
    getNotificationCount((err,result)=>{
      if(err)
        reject(err);
       else
        resolve(result); 
    })
  });
}

app.get('/notifications/count',(req,res)=>{
  var responseObj = {};
  NotificationCount()
  .then((count)=>{
    responseObj.data = {nCount:count};
    res.status(200).send(responseObj);
  })
  .catch((err)=>{
    res.status(500).send(err);
  })
});

import { getNotificationData } from './db/dbRequestHandler';
function NotificationData() {
  var responseObj = { data: null };
  return new Promise((resolve, reject) => {
    getNotificationData((err, result) => {
      if (err)
        reject(err);
      else
        resolve(result);
    })
  })
}

app.get("/notifications", (req, res, next) => {
  var responseObj = { data: null };
  NotificationData()
    .then((result) => {
      responseObj.data = result;
      req.resMessage = responseObj;
      next();
    })
    .catch((err) => {
      res.status(500).send("Internal server error occured");
    })
})

// request to fetch plant names and company names
// app.get("/company/companies-list", jwtToken, (req, res) => {
app.get("/api/company/companies-list", (req, res) => {
  // var method = req.method;
  // if(req.session.token && !(req.session.err))
  // {
  //   var config = {
  //    headers: {
  //     "Content-Type": 'application/json;charset=UTF-8',
  //     "Access-Control-Allow-Origin": "*",
  //     "Authorization": "Bearer "+req.session.token,  
  //   },
  // }
  // var data = {'json-token':  req.session.token};
  // axios request to the tomcat server to fetch company names
  Axios.get("http://127.0.0.1:8090/api/company-names")
    .then((apiResponse) => {
      if (apiResponse.data.data) {
        return res.status(200).send(apiResponse.data.data.companyNames);
      }
      else {
        return res.status(500).send(apiResponse.data.status.message);
      }
    })
    .catch((error) => {
      return res.status(204).send("error in making request to the external server");
    })
  // else{
  //   return res.status(500).send("internal server error occured in generating token");
  // }
})


app.get("/api/company/:_companyId/plantsList", (req, res) => {
  //mock response for fetching plant names
  const companyId = req.params._companyId;
  //   // if(req.session.token && !(req.session.err))
  //   // {
  //   //   var config = {
  //   //    headers: {
  //   //     "Content-Type": 'application/json;charset=UTF-8',
  //   //     "Access-Control-Allow-Origin": "*",
  //   //     "Authorization": "Bearer "+req.session.token,  
  //   //   },
  //   // }
  // axios request to the tomcat server to fetch plant names
  Axios.get("http://127.0.0.1:8090/api/plant-names/?companyId=" + companyId)
    .then((Response) => {
      if (Response) {
        return res.status(200).send(Response.data.data.plantNames);
      }
      else {
        return res.status(500).send(Response.data.status.message);
      }
    })
    .catch((error) => {
      res.status(204).send("no response received");
    })
  //   // else{
  //   //   res.status(500).send("internal server error occured in generating token");
  //   // }
  // });
})

app.get("*", (req, res) => {
  // if (req.originalUrl === "/" || req.originalUrl === "/logout") {
  //   res.redirect("/login");
  //   return;
  // }
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    let data;
    if (req.url.slice(1, ) === 'dashboard') {
      data = fetchDashboardData();
    }
    else {
      data = req.resMessage;
      req.resMessage = "";
    }
    res.send(data);
  } else {
    let initialData;
    if (req.url.slice(1, ) === 'dashboard')
      initialData = fetchDashboardData();
    else {
      initialData = req.resMessage;
      req.resMessage = "";
    }
    var routeMatched = routes.find(routes =>
      matchPath(req.originalUrl, routes.path)
    );
    if (typeof routeMatched != "undefined") {

      Promise.resolve()
        .then(() => {
          const context = {};
          initialData = initialData ? initialData : "";
          let role = req.session.role ? req.session.role : "";
          var content = renderToString(
            <StaticRouter location={req.url} context={context}>
              <App />
            </StaticRouter>
          );
          res.render("app.ejs", { content, initialData, role });
        })
        .catch(err => {
          console.log("error : " + err);
        });
    } else {
      const error_markup = renderToString(<Error404 />);
      res.render("app.ejs", { content: error_markup, initialData: {}, role: "" });
    }
  }
});

app.listen(3000, () => {
  console.log("connected to port 3000...");
});


var fetchDashboardData = () => {
  return { data: "Dashboard Requested" }
}
