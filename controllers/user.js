const User = require("../models/user");
const service = require("../services/IService")(User);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const API = require("../apis");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

require("dotenv").config();

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.mySecretKey);
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.myRefreshSecretKey);
};

module.exports = {
  getOne: async (req, res) => {
    const user = await service.getOne(req.params.id);
    return res.status(200).json(user);
  },

  getAll: async (req, res) => {
    const users = await service.getAll();
    return res.status(200).json(users);
  },

  register: async (req, res) => {
    try {
      let user = await service.getOneBy({ username: req.body.username }, false);
      if (user) {
        return res.status(200).json({ error: "username used" });
      }
      user = await service.save({
        username: req.body.username,
        password:
          req.body.password && (await bcrypt.hash(req.body.password, 10)),
        fullName: req.body.fullName,
        avatar: req.body?.avatar,
      });

      const accessToken = generateAccessToken({ ...user });

      res.cookie("access_token", accessToken, {
        maxAge: 365 * 24 * 60 * 60 * 100, // thời gian sống
        httpOnly: true, // chỉ có http mới đọc được token
        //secure: true; //ssl nếu có, nếu chạy localhost thì comment nó lại
      });

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },

  login: async (req, res) => {
    const user = await service.getOneBy({ username: req.body.username }, false);
    if (!user) {
      return res.status(200).json("User not found");
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(200).json("Wrong password");
    }

    const accessToken = generateAccessToken({ ...user });

    res.cookie("access_token", accessToken, {
      maxAge: 365 * 24 * 60 * 60 * 100, // thời gian sống
      httpOnly: true, // chỉ có http mới đọc được token
      secure: true, //ssl nếu có, nếu chạy localhost thì comment nó lại
      sameSite: "none",
    });

    return res.status(200).json({ ...User.toDTO(user) });
  },

  logout: async (req, res) => {
    res.clearCookie("access_token");
    return res.status(200).json("You logged out successfully.");
  },
};