const isUserAuthenticated = (req, res, next) => {
    const token = 'xyz';
    if (token !== 'xyz') {
        res.send("You are not authorized")
    }
    else {
        next();
    }
}

module.exports = {isUserAuthenticated}