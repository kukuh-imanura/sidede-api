const response = (statusCode, data, message, res) => {
  res.status(statusCode).json({
    message: message,
    datas: data,
  });
};

export default response;
