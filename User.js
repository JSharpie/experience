var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: {type: String, lowercase: true},
  password: {type: String},
  stats: {
    strength: {type: Number},
    endurance: {type: Number},
    dexterity: {type: Number},
    intelligence: {type: Number},
    wisdom: {type: Number}
  },
  currGoals: {type: Array},
  completedGoals: {type: Array}
});

var User = mongoose.model("User", userSchema);

module.exports = User;
