const Comment = require("../models/comment");
const Post = require("../models/post");
const service = require("../services/IService")(Comment);
const postService = require("../services/IService")(Post);
// const io = require("../socket").getIO();

module.exports = {
  getOne: async (req, res) => {
    const comment = await service.getOne(req.params.id);
    return res.status(200).json(comment);
  },
  getAll: async (req, res) => {
    const comments = req.query.postId
      ? await service.getAllBy({ postId: req.query.postId })
      : await service.getAll();
    return res.status(200).json(comments);
  },
  save: async (req, res) => {
    try {
      const comment = await service.save({
        images: req.body?.images,
        text: req.body?.text,
        postId: req.body.postId,
        userId: req.body.userId,
      });

      const post = await postService.getOne(
        req.body.postId,
        (formatToDTO = false)
      );
      await postService.update({
        id: req.body.postId,
        totalComment: post.totalComment + 1,
      });
      return res.status(200).json(comment);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
};
