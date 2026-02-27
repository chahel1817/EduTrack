const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`🚨 [SERVER ERROR]: ${message}`);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorMiddleware;
