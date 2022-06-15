import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  syllables: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("name", schema);
