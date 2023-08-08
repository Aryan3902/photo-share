const { mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  Upvotes: {
    type: Number,
    required: true,
    ref: "User"
  }
});

module.exports = mongoose.model("Place", placeSchema);
