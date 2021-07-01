const Post=require('../model/post');

const User=require('../model/user');


module.exports.home= async function(req,res){

     try{
                  // CHANGE :: populate the likes of each post and comment
         //populate the user of each post
   let posts = await Post.find({})

   .sort('-createdAt')
   
   .populate('user')
   .populate({
       path:'comments',
       populate:{
           path:'user'
       },
       populate: {
        path: 'likes'
    }
   }).populate('comments')
   .populate('likes');

   
   
  let users= await User.find({});

   return res.render('home',{
  
        titile:" Codeial | HOME",
        posts:posts,
        all_users:users

       }); 
     }
     catch(err){
                
        console.log('Error',err);
        return ;
     }
   

}




//using then
//Post.find({}).populate('comments').then(function());


//let posts=Post.find({}).populate('comments').exec();
//posts.then();  \\promises work like this 



