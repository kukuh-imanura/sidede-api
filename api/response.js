const response = (statusCode, data, message, res) => {
  res.status(statusCode).json({
    message: message,
    result: data,
  });
};

export default response;
