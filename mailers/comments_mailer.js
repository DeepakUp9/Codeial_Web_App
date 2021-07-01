const nodemailer = require('../config/nodemailer');


//this is  another way of exporting a  method 
exports.newComment = (comment) => {

    // console.log('inside comment mailer');
     

    // using mailer template 
    let htmlString = nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');



      nodemailer.transporter.sendMail({
          
           from:'deepak858933265@gmail.com',

           to:comment.user.email,

           subject:"New Commnet Published!",

         //  html:'<h1> Yup ,your comment is now Published! </h1>'
         html:htmlString

      },(err,info) => {
            
        if(err){
            console.log("Error in sending the mail",err);
            return;
        }

        console.log('Message sent', info);

        return;
           

      });

}