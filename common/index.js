const moment = require("moment");
const objectMapper = require("object-mapper");

const patternDateTime = "h:mm:ssA MM/DD/YYYY";

module.exports = {
  formatDateTime: (value) => {
    return moment(value).format(patternDateTime);
  },
  objectMapper,
};
