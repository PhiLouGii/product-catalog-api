class ApiError extends Error {
    constructor(statusCode, message, details = {}) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
    }
  }
  
  const errorHandler = (err, req, res, next) => {
    console.error(err);
  
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: err.errors
      });
    }
  
    // Handle custom API errors
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        error: err.message,
        details: err.details
      });
    }
  
    // Fallback for unexpected errors
    res.status(500).json({
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };
  
  module.exports = {
    ApiError,
    errorHandler
  };