const ObjectId = require("mongoose").Types.ObjectId;

module.exports = (Model) => {
  const { model, toDTO, toDTOs } = Model;
  return {
    getAll: async (formatToDTOs = true) => {
      const records = await model.find();
      return formatToDTOs ? await toDTOs(records) : records;
    },

    getOne: async (id, formatToDTO = true) => {
      if (!ObjectId.isValid(id)) return null;
      const record = await model.findById(id).exec();
      return formatToDTO ? await toDTO(record) : record;
    },

    getOneBy: async (conditions, formatToDTO = true) => {
      const record = await model.findOne(conditions).exec();
      return formatToDTO ? await toDTO(record) : record;
    },

    getAllBy: async (conditions, formatToDTOs = true) => {
      const records = await model.find(conditions).exec();
      return formatToDTOs ? await toDTOs(records) : records;
    },

    deleteOne: async (id, formatToDTO = true) => {
      if (!ObjectId.isValid(id)) return null;
      const record = await model.deleteOne({ _id: id });
      return formatToDTO ? await toDTO(record) : record;
    },

    save: async (data, formatToDTO = true) => {
      try {
        const newModel = await new model(data);
        const record = await newModel.save();
        return formatToDTO ? await toDTO(record) : record;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    update: async (data, formatToDTO = true) => {
      const record = await model.findByIdAndUpdate(data.id, data, {
        new: true,
      });
      return formatToDTO ? await toDTO(record) : record;
    },
  };
};
