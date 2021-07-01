const express=require('express');

const router=express.Router();

const passport=require('passport');

const PostsController=require('../controllers/posts_controller');


//for creating a post
router.post('/create',passport.checkAuthentication,PostsController.create);

//for deleting  post
router.get('/destroy/:id',passport.checkAuthentication,PostsController.destroy);



module.exports=router;
