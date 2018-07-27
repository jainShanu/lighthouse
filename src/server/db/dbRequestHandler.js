import db from "./dbConfig.js";
import dbModel from "./dbModels.js"
import response from "../respone-object/response.js";
import session from "../sessionConfig";
const formModel = dbModel.Form,
    UserModel = dbModel.Users;

export function loginRequestHandler(req, res) {
    //should include bcrypt.js to encrypt the password instead of exposing it.
    var emailId = req.body.email,
        Password = req.body.password;
    var username = null, role = null, responseObj = { Success: false, role: null };
    UserModel.find({ emailId }, (err, user) => {
        if (err) {
            throw err;

        } else {
            //users is undefined or password not matched

            if (!user[0] || user[0].password !== Password) {
                res.status(403).end(responseObj);
                //res.send(response);
            } else {
                if (user[0].role.admin) {
                    role = "admin";
                }
                if (user[0].role.operationManager) {
                    role = "operationManager";
                }
                username = user[0].username;
                responseObj.Success = true;
                responseObj.role = role;
                responseObj.username = username;
                var prev_sessionId = req.sessionID;
                req.session.regenerate(err => {
                    if (err) throw err;
                    else {
                        session.store.destroy(prev_sessionId, err => {
                            if (err) throw err;
                        });
                        req.session._authenticated = true;
                        req.session.role = role;
                        req.session.user = username;
                        req.session.cookie.maxAge = 3 * 24 * 3600 * 1000;
                        res.status(200).send(responseObj);
                    }
                })
            }
        }
    })
}
export function HistoryRequestHandler(role, username, cb) {
    // var resposne={success:false,result:null};
    var query = null
    if (role === 'admin') {
        //query to send all the form document sorting based on dispatchDate
        query = formModel.find({}).sort({ 'dateDispatched': -1 });
    }
    else {
        query = formModel.find({ 'dispatchedBy': username }).sort({ 'dateDispatched': -1 });
    }
    query.exec().
        then((result) => {
            var err = null
            cb(err, result)
        })
        .catch((error) => {
            var result = null
            cb(error, result);
        })
}

export function saveFormData(data, cb) {
    var form = formModel(data);
    form.save((err) => {
        if (err) {
            cb(err);
        }
        var err = null;
        cb(err);
    })
}

export function getNotificationData(cb) {
    var query = formModel.find().where('hasValidated').equals(false).select('_id dispatchedBy plant company')
    query.exec()
        .then((result) => {
            var error = null;
            cb(error, result);
        })
        .catch((error) => {
            var result = null;
            cb(error, result);
        });
}

export function getNotificationCount(cb) {
    var query = formModel.count();
    query.exec()
        .then((count) => {
            cb(null, count);
        })
        .catch((err) => {
            cb(err,null);
        })
}