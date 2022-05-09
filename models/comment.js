const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { formatDateTime, objectMapper } = require("../common");
const User = require("../models/user");
const Post = require("../models/post");
const userService = require("../services/IService")(User);
const postService = require("../services/IService")(Post);

const commentSchema = new Schema(
  {
    text: {
      type: String,
      // required: [true, "Name required"],
    },
    images: {
      type: Array,
      default: [],
    },
    totalComment: { type: Number, default: 0 },
    // totalShare: { type: Number, default: 0 },
    // totalLike: { type: Number, default: 0 },
    postId: { type: Schema.ObjectId, required: [true, "postId required"] },
    userId: { type: Schema.ObjectId, required: [true, "userId required"] },
  },
  { timestamps: true }
);

const map = {
  _id: "id",
  text: "text",
  images: "images",
  postId: "postId",
  userId: "userId",
  createdAt: {
    key: "createdAt",
    transform: formatDateTime,
  },
  updatedAt: {
    key: "updatedAt",
    transform: formatDateTime,
  },
};

const toDTO = async (src) => {
  if (!src) return null;
  let DTO = objectMapper(src, map);
  DTO.user = await userService.getOne(DTO.userId);
  DTO.post = await postService.getOne(DTO.postId);
  delete DTO.userId;
  delete DTO.postId;
  return DTO;
};

module.exports = {
  model: mongoose.model("Comment", commentSchema),
  toDTO: toDTO,
  toDTOs: async (src) => {
    if (!src) return [];
    return Promise.all(src.map((s) => toDTO(s))).then((result) => result);
  },
};
