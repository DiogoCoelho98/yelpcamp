module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
}; // A function that accepts a function, and executes that function, but catches any error and passes them to the next Express middleware