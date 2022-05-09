const mongoose = require("mongoose");
const { formatDateTime, objectMapper } = require("../common");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Name required"],
    },
    fullName: {
      type: String,
      required: [true, "Full name required"],
    },
    password: {
      type: String,
      required: [true, "Password required"],
    },
    avatar: { type: String },
  },
  { timestamps: true }
);

const map = {
  _id: "id",
  username: "username",
  fullName: "fullName",
  avatar: "avatar",
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
  return src ? objectMapper(src, map) : null;
};

module.exports = {
  model: mongoose.model("User", userSchema),
  toDTO: (src) => objectMapper(src, map),
  toDTOs: async (src) => {
    if (!src) return [];
    return Promise.all(src.map((s) => toDTO(s))).then((result) => result);
  },
};
