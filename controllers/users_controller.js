const User=require('../model/user');

const fs=require('fs');

const path=require('path');





module.exports.profile = function(req, res){

    User.findById(req.params.id,function(err,user){
        
        return res.render('user_profile', {
            titile: 'User Profile',
            profile_user:user
      
     });
   
    });

}

//for updating  user name and email
module.exports.update= async function(req,res){
     
    //   if(req.user.id==req.params.id){

    //     User.findByIdAndUpdate(req.params.id,req.body, function(err,user){
         
    //         req.flash('success', 'Updated!');

    //         return res.redirect('back');

    //     });

    //   }else{
    //       req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('Unauthorized');
    //   }






    if(req.user.id==req.params.id){
       
        try{
       
            let user= await User.findById(req.params.id);
            
            User.uploadedAvatar(req,res,function(err){

                if(err){
                    console.log('******* multer Error',err);

                }

                //console.log(req.file);
                user.name=req.body.name;
                user.email=req.body.email;

                if(req.file){
                     
                    //replacing avatar
                    // if(user.avatar){
                    //    fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    // }

                    //this is saving the path of the uploaded file into the avatar field in the user 
                    user.avatar=User.avatarPath + '/' + req.file.filename;
                }

                user.save();

                req.flash('success', 'Updated!');
                return res.redirect('back');
            });

        }
        catch(err){
              req.flash('error',err);
              return res.redirect('back');
        }


    }

    else{
               req.flash('error', 'Unauthorized!');
            return res.status(401).send('Unauthorized');
          }






}




//render the sing up page
module.exports.signUp=function(req,res){

    //making sing up page available only when the user is sing-out
    if(req.isAuthenticated()){
       return  res.redirect('/users/profile');
    }

   return res.render('user_sign_up',{
    titile:"codeial| Sign Up"

   });
}


//render the sing in page
module.exports.signIn=function(req,res){

    //making sing in page available only when the user is sing-out
    if(req.isAuthenticated()){
       return  res.redirect('/users/profile');
    }


    return res.render('user_sign_in',{
        titile:"codeial| Sign In"
    });
}


// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){req.flash('error', err); return}

                return res.redirect('/users/sign-in');
            });
        }else{
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}




// sign in and create a seesion for the user
module.exports.createSession=function(req,res){
   
    //using for flash message
    req.flash('success','Logged in Successfully');

    return res.redirect('/');

}

//sign-out
module.exports.destroySession=function(req,res){
         req.logout();

      //using for flash message
    req.flash('success','You have Logged out!');


    return res.redirect('/');
}

