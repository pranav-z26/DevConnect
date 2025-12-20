const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://pranavzagade:Karad%402608@pranavnode.sqxrlly.mongodb.net/?appName=PranavNode')
}

module.exports = {connectDb};
