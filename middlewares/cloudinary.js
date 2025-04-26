const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME ||'dhh9j0ion',
  api_key: process.env.API_KEY ||'488515883499643',
  api_secret: process.env.API_SECRET ||'yLs10KBBnvph_RhhRkE7tY8oymk',
});

module.exports = cloudinary;
