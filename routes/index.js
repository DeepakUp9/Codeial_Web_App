const express=require('express');

const router=express.Router();

const homeController=require('../controllers/home_controller');





router.get('/',homeController.home);

router.use('/users',require('./users'));



router.use('/posts',require('./posts'));


router.use('/comments',require('./comments'));


//for an api
router.use('/api',require('./api'));

//for likes 

router.use('/likes',require('./likes'));






module.exports=router;
