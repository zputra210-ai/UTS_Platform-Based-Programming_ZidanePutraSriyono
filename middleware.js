const AUTH_TOKEN = "Zidane-Library";

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
};

const requireAuth = (req, res, next) => {
    const token = req.headers["x-auth-token"];

    if(token !== AUTH_TOKEN) {
        return res.status(401).json({
            message: "Unauthorized. Invalid or missing authentication token"
        });
    }

    next();
};

const notFound = (req, res, next) => {
    const error = new Error(`Route Not Found: ${req.originalUrl}`);
    error.status = 404;

    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;

    res.status(statusCode).json({
        message: err.message || "Internal Server Error"
    });
};

module.exports = {
    logger,
    requireAuth,
    notFound,
    errorHandler
};