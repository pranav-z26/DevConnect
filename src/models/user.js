const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            //validator npm package - here db level validation
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        // validate(value) {
        //     if (!validator.isStrongPassword(value)) {
        //         throw new Error("Password is not strong enough")
        //     }
        // }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        //custom validation
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender not valid!!!")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-black-default-avatar-image_2237212.jpg"
    },
    about: {
        type: String,
        default: "This is the deafult value of about"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
}
)

module.exports = mongoose.model("User", userSchema)