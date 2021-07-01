const express =require('express');


//set up our cookies 
const cookieParser=require('cookie-parser');


const app=express();

const port=8000;



//layout file load and use 
const expressLayout=require('express-ejs-layouts');
//uses mongooose db here ,connecting to DB  
const db=require('./config/mongoose');



//setting up session cookie using express-session
//used for seesion cookie
const session=require('express-session');
// use passport 
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');

//use passport-jwt
const passportJWT=require('./config/passport-jwt-strategy');


//use google ouAth
const passportGoogle = require('./config/passport-google-oauth2-strategy');



//store session cookies permantely in mongodb
const MongoStore=require('connect-mongo');



//using the SASS Middleware
const sassMiddleware=require('node-sass-middleware');
app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:false,
    outputStyle:'extended',
    prefix:'/css'


}));



//for chatting engine
// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');








//using for flash message
const flash=require('connect-flash');
const customMware=require('./config/middleware');



//reading through POST request or form data
app.use(express.urlencoded());


//set up our cookies 
app.use(cookieParser());


//setting up static files
//first i need to tell in which folder should the app look out for static files
app.use(express.static('./assets'));


//for profile picture showing 
//make the upload path available to the browser 
app.use('/uploads',express.static(__dirname + '/uploads'));


//layout file load and use
app.use(expressLayout);


//extract style and script from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


//set up the view engine  
app.set('view engine','ejs');
app.set('views','./views');


//setting up session cookie using express-session
//used for seesion cookie
//mongo store is used  to store the session cookies in the db
app.use(session({
    name:'codeial',
    //TODO  change the secret before the deployment in  production mode
    secret:'DeepakKumar',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)  //in millisecond 
    },

    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/codeial_development_DB',
        autoRemove: 'disabled'
      },
      
        function(err){
            console.log(err|| 'connect-mongodb setup ok');
        }
    )


}));
app.use(passport.initialize());
app.use(passport.session());
//set up the current user uses 
app.use(passport.setAuthenticatedUser);


//using for flash message
app.use(flash());
app.use(customMware.setFlash);




//use express router
app.use('/',require('./routes'));



app.listen(port,function(err){

    if(err){
        console.log(`Error in running the server:${err}`);
        return;
    }

    console.log(`Server is running on port :${port}`);
    

});