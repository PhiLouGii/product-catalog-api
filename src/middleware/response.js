const successResponse = (res, data, status = 200) => {
    res.status(status).json({ success: true, data });
  };
  
  const errorResponse = (res, message, status = 500) => {
    res.status(status).json({ 
      success: false, 
      error: { code: status, message } 
    });
  };
  
  module.exports = { successResponse, errorResponse };