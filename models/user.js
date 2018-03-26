//Criar a instancia do mongoose e do mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//criar o modelo do mongoose e passar durante module.exports
module.exports = mongoose.model('User', new Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String }
}));
