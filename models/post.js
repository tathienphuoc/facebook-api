const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../models/user");
const userService = require("../services/IService")(User);
const { formatDateTime, objectMapper } = require("../common");

const postSchema = new Schema(
  {
    text: {
      type: String,
      // required: [true, "Name required"],
    },
    images: {
      type: Array,
      default: [],
    },
    videos: {
      type: Array,
      default: [],
    },
    totalComment: { type: Number, default: 0 },
    totalShare: { type: Number, default: 0 },
    totalLike: { type: Number, default: 0 },
    likes: { type: Array, default: [] },
    userId: { type: Schema.ObjectId, required: [true, "userId required"] },
  },
  { timestamps: true }
);

const map = {
  _id: "id",
  text: "text",
  images: "images",
  videos: "videos",
  likes: "likes",
  totalShare: "totalShare",
  totalLike: "totalLike",
  totalComment: "totalComment",
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
  console.log(DTO.userId);
  DTO.user = await userService.getOne(DTO.userId);
  delete DTO.userId;
  return DTO;
};

module.exports = {
  model: mongoose.model("Post", postSchema),
  toDTO: toDTO,
  toDTOs: async (src) => {
    if (!src) return [];
    return Promise.all(src.map((s) => toDTO(s))).then((result) => result);
  },
};
