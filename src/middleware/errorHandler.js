app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({
      error: {
        code: status,
        message: err.message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      }
    });
  });