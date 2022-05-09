const { User } = require("../models/user");
const service = require("./IService")(User);

module.exports = {
  getAll: async () => {
    return await service.getAll();
  },

  getOne: async (id) => {
    return await service.getOne(id);
  },

  getOneBy: async (conditions) => {
    return await service.getOneBy(conditions);
  },

  save: async (user) => {
    return service.save(user);
  },
};
