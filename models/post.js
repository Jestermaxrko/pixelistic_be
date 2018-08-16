const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  author:{
    type: mongoose.Schema.ObjectId , ref: 'User',
    required: true
  },
  likes: [{ type:  mongoose.Schema.ObjectId, ref: 'User' }],
  comments: [{
    comment: {
      type: String,
      require: true
    },
    author: {
      type: String,
      required: true
    }
  }],
  geolocation: String,
  description: String,
  timestamp: Number
});

PostSchema.statics.addPost = async (req, res, next) => {
  try{
    req.body.post.timestamp = Date.now(); 
    const addedPost = await Post.create(req.body.post);
    req.addedPost = await Post.populate(addedPost, { path: 'author', select: 'nickname avatar' });
    next();
  } catch(err) {
    next(err);
  }
}

PostSchema.statics.addLike = async (req, res, next) => {
  let updatedPost = await Post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.body.userId } }, { new: true });
  req.likes = updatedPost.likes;
  req.postId = updatedPost._id;
  next();
}

PostSchema.statics.removeLike = async (req, res, next) => {
  let updatedPost = await Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.body.userId } }, { new: true });
  req.likes = updatedPost.likes;
  req.postId = updatedPost._id;
  
  next();
}

PostSchema.statics.addComment = async (req, res, next) => {
  const comment = {
    comment: req.body.comment,
    author: req.body.userNickname
  }

  let updatedPost = await Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true });
  req.comments = updatedPost.comments;
  req.postId = updatedPost._id;
  
  next();
}
const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
