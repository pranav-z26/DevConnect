const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://pranavzagade:Karad%402608@pranavnode.sqxrlly.mongodb.net/devConnect?appName=PranavNode')
}

module.exports = {connectDb};
