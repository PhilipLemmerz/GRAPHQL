const Entry = require('../model/entry');
const Users = require('../model/users');
const io = require('../socket')

exports.create = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const userID = req._id;
  let newPost;

  const entry = new Entry({
    title: title,
    content: content,
    user_id: userID
  })
  entry.save()
    .then( (post) => {
      newPost = post;
      return Users.findOne({_id: post.user_id})
    })
    .then( user => {
      io.getIO().emit('posts', {action: 'create', data: newPost })
      user.posts.push(newPost);
      return user.save();
    })
    .then( user => res.status(201).json({ messagae: 'item Created !', post: newPost, user: user }))
    .catch((error) => console.log(error));
}

exports.loadAll = (req, res, next) => {
  Entry.find().then((entries) => {
    res.json(entries);
  }
  ).catch( () => {
    res.status(500).json({message: 'resource not found'})
  });
}

exports.deleteItem = (req, res, next) => {
  const _id = req.params.id;
  Entry.findByIdAndRemove(_id)
  .then( (deletedItem) => {
    res.status(200).json({message: 'post successfully deleted', data: deletedItem});
  })
  .catch( (err) => res.stauts(500).json({message: 'No Resource Found'}));
}
