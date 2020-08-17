const fs = require("fs");
const path = require("path");

const deleteImage = (imagePath) => {
  imagePath = path.join(__dirname, "..", imagePath);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports.deleteImage = deleteImage;
