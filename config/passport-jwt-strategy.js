const passport=require('passport');
const JWTStrategy=require('passport-jwt').Strategy;
const ExtractJWT=require('passport-jwt').ExtractJwt;


const User=require('../model/user');


let opts= {
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),

    secretOrKey : "codeial"

}


passport.use(new JWTStrategy (opts,function(jwtpayLoad,done){

    User.findById(jwtpayLoad._id,function(err,user){
        
        if(err){
            console.log("Error in finding user from jwt");
            return;
        }

        if(user){
            return done(null,user);
        }
        else{
            return done(null,false);
        }

    });
           

}));




module.exports=passport;