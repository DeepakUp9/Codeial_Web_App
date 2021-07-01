const express=require('express');

const router=express.Router();

const passport=require('passport');

const commentsController=require('../controllers/comments_controller');


//creating comment 
router.post('/create',passport.checkAuthentication, commentsController.create);



//for deleting comment
router.get('/destroy/:id',passport.checkAuthentication, commentsController.destroy);

module.exports=router;
