const response = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    message: message,
    result: data,
  });
};

export default response;
