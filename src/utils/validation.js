const validator = require('validator');

const validateSignupData = (req) => {
    const { firstName, emailId, password } = req.body;

    if(!firstName || !emailId || !password){
        throw new Error("firstName, emailId and password are required fields");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
}

const validateProfileEditData = (req) => {
    const EDIT_ALLOWED_FIELDS = ["firstName", "lastname", "age", "gender", "photoUrl", "about", "skills"];

    const isEditAllowed = Object.keys(req.body).every(k => EDIT_ALLOWED_FIELDS.includes(k));

    return isEditAllowed;
}

const validatePasswordUpdateData = (req) => {
    const { password } = req.body;
    if(!password){
        throw new Error("Password field is required");
    }
    //additional password strength validations can be added here
    // e.g., minimum length, special characters, etc. or use validator.isStrongPassword
    return true;
}

module.exports = {
    validateSignupData,
    validateProfileEditData,
    validatePasswordUpdateData
};