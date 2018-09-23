const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moment = require("moment");
const format = {
  date: "MM-D-YYYY",
  time: "h:mm a"
};

const options = {
  versionKey: { versionKey: false },
  collection: { collection: "Fragments" }
}

const FragmentSchema = new Schema(
  {
    body: {
      type: String,
      required: true   
    },
    title: {
      type: String,
      required: false
    },
    tags: {
      type: [String],
      required: false
    },
    createdOn: {
      date: {
        type: String,
        default: moment().format(format.date)
      },
      time: {
        type: String,
        default: moment().format(format.time)
      }
    }
  }, 
  options.versionKey,
  options.collection
);

const Fragment = mongoose.model("Fragment", FragmentSchema);

module.exports = Fragment;