import jwt from 'jsonwebtoken';
import config from './config';

var role,
    clientName,
    secret,
    token;
const createToken = (req,res,next)=>{
    // cookies with request is not empty and req.sesssion is empty
    if(!(req.cookies) && !(req.session))
        return res.status(403).send("invalid request");
    if(req.session._authenticated==false || !(req.session.username) || !(req.session.role))
    {
        return res.status(403).send("unauthenticated user");
        // console.log(req.session);
        // req.session._authenticated = true;
        // req.session.username = "someuser";
        // req.session.role = "admin";
    }        
    clientName = req.session.username;
    secret = config.secret;
    // sign token using expiration date role, iss, clientName
    jwt.sign({"role":req.session.role,"iss":clientName,"sub":"internal-dashboard-dispatch-form"},secret,{expiresIn:3*24*60*60},function(err,token){
        if(err)
        {
            req.session.err = err;
            throw err;
        }    
        else
        {
            req.session.token = token;
        }   
        next();
    })
}
module.exports = createToken;