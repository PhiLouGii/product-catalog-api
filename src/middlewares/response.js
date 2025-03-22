const successResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data
  });
};

const errorResponse = (res, error, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      message: error.message,
      details: error.details || undefined
    }
  });
};

const paginatedResponse = (res, data, pagination) => {
  res.status(200).json({
    success: true,
    data,
    pagination
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};