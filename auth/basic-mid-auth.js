'use strict';

// to convert the entered password to some random string ( the first stage of security )
const base64 = require('base-64');

const users = require('./users.js');

// function to attach the base64 password into request headers as a property 
module.exports = (req,res,next) =>{

  console.log('req.headers.authorization : ', req.headers.authorization);

  // to check if the login process is valid or not by right information login 
  if(!req.headers.authorization)
  {
    next(' Invalid Login Process basic auth  ');
    return;
  }

  // take the 2nd element in the request header to divide the username and password to be able to created aanew token after that  
  // let auth2ndElement = req.headers.authorization;
  // console.log('auth2ndElement : ', auth2ndElement);
  let basic = req.headers.authorization.split(' ').pop();
  console.log('basic : ', basic);

  // pass and username that the inside and entered by user when he want to login again  
  // take the pass and the username (destruction) username:password 
  let [user,pass] = base64.decode(basic).split(':');
  console.log('[user,pass] : ', [user,pass]);

  // to make sure if the user when signin is valid or not 
  users.authenticateUser(user,pass)
    .then(isValidUser => {
      console.log('isValidUser : ', isValidUser);
      req.token = users.genToken(isValidUser);
      console.log('req.token : ', req.token);
      next();
    })
    .catch(err =>
    {
      next(' Invalid User Error ', err);
    });
}; // end of export 
