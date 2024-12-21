const response = (res, statusCode, message, data) => {
  res.status(statusCode).json({
    message: message,
    result: data,
  });
};

export default response;
