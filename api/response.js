const response = (res, statusCode, message, data, prev, next, max) => {
  res.status(statusCode).json({
    message,
    result: data,
    pagination: {
      prev,
      next,
      max,
    },
  });
};

export default response;
