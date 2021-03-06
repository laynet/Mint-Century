const Post = require("./models").Post;
const Authorizer = require("../policies/application");

module.exports = {
  getAllPosts(callback) {
    return Post.findAll()
      .then(posts => {
        callback(null, posts);
      })
      .catch(err => {
        callback(err);
      });
  },
  addPost(newPost, callback) {
    return Post.create({
      title: newPost.title,
      body: newPost.body
    })
      .then(post => {
        callback(null, post);
      })
      .catch(err => {
        callback(err);
      });
  },
  getPost(id, callback) {
    return Post.findById(id)
      .then(post => {
        callback(null, post);
      })
      .catch(err => {
        callback(err);
      });
  },
  deletePost(req, callback) {
    return Post.findById(req.params.id)
      .then(post => {
        const authorized = new Authorizer(req.user, post).destroy();
        if (authorized) {
          post.destroy().then(res => {
            callback(null, post);
          });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          callback(401);
        }
      })
      .catch(err => {
        callback(err);
      });
  },
  updatePost(req, updatedPost, callback) {
    return Post.findById(req.params.id).then(post => {
      if (!post) {
        return callback("Post not found");
      }
      const authorized = new Authorizer(req.user, post).update();
      if (authorized) {
        post
          .update(updatedPost, {
            fields: Object.keys(updatedPost)
          })
          .then(() => {
            callback(null, post);
          })
          .catch(err => {
            callback(err);
          });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback("forbidden");
      }
    });
  }
};
