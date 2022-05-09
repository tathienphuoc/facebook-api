const Post = require("../models/post");
const Comment = require("../models/comment");
const service = require("../services/IService")(Post);
const commentService = require("../services/IService")(Comment);
const io = require("../socket").getIO();

module.exports = {
  delete: async (req, res) => {
    try {
      const id = req.body.postId;
      const userId = req.body.userId;
      const post = await service.getOne(id);
      if (post.user.id != userId) {
        return res.status(401).json("You aren't allowed to delete this post");
      }

      const comments = (await commentService.getAllBy({ postId: id })).map(
        (comment) => commentService.deleteOne(comment.id)
      );

      await service.deleteOne(id);

      await Promise.all(comments);

      return res.status(200).json("ok");
    } catch (error) {
      console.log(error);
    }
  },

  update: async (req, res) => {
    const id = req.body.postId;
    const userId = req.body.userId;
    const post = await service.getOne(id);
    if (post.userId != userId) {
      return res.status(401).json("You aren't allowed to update this post");
    }

    const updated = await service.update({
      id,
      images: req?.files,
      text: req.body?.text,
    });

    console.log(req.body?.text);
    console.log(updated);

    return res.status(200).json(updated);
  },

  like: async (req, res) => {
    try {
      const id = req.body.postId;
      const userId = req.body.userId;
      let post = await service.getOne(id, (formatToDTO = false));

      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter((id) => id != userId);
        post.totalLike -= 1;
      } else {
        post.likes.push(userId);
        post.totalLike += 1;
      }

      post = await service.update({
        id,
        likes: post.likes,
        totalLike: post.totalLike,
      });

      return res.status(200).json(post);
    } catch (error) {
      console.log(error);
    }
  },
  getOne: async (req, res) => {
    const post = await service.getOne(req.params.id);
    return res.status(200).json(post);
  },
  getAll: async (req, res) => {
    const posts = await service.getAll();
    return res.status(200).json(posts);
  },
  save: async (req, res) => {
    try {
      const post = await service.save({
        images: req?.files || [],
        totalComment: req.body?.totalComment,
        totalShare: req.body?.totalShare,
        totalLike: req.body?.totalLike,
        userId: req.body.userId,
        text: req.body?.text,
      });
      return res.status(200).json(post);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};
