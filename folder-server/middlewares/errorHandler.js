const errorHandler = (err, req, res, next) => {
  console.log(err);

  let status = 500;
  let message = 'Internal Server Error';

  // Validation error dari Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    status = 400;
    message = err.errors[0].message;
  }

  // Error custom
  else if (err.name === 'BadRequest') {
    status = 400;
    message = err.message;
  }
  else if (err.name === 'Unauthorized') {
    status = 401;
    message = err.message;
  }
  else if (err.name === 'Forbidden') {
    status = 403;
    message = err.message;
  }
  else if (err.name === 'NotFound') {
    status = 404;
    message = err.message;
  }
  else if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }
  else if (err.name === 'ValidationError') {
    status = 400;
    message = err.message || 'Validation failed';
  }
  else if (err.name === 'GeminiAPIError') {
    status = err.status || 500;
    message = err.message || 'Error with Gemini API';
  }

  res.status(status).json({ message });
};

module.exports = errorHandler;