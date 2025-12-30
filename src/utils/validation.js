const validator = require('validator');

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password, age } = req.body;

    if(!firstName || !emailId || !password){
        throw new Error("firstName, emailId and password are required fields");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
}

module.exports = {
    validateSignupData
};