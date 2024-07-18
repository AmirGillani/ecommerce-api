const mongoose = require("mongoose");

function connection() {
  mongoose
    .connect("mongo://127.0.0.1:27017/")
    .then((data) => {
      console.log(`server is running ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = connection;
