const errorHandler = require('../../middlewares/errorHandler');

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Mock Express request, response, and next function
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Spy on console.log to prevent actual logging during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.log
    console.log.mockRestore();
  });

  it('should handle SequelizeValidationError with 400 status', () => {
    const err = {
      name: 'SequelizeValidationError',
      errors: [{ message: 'Validation error message' }]
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Validation error message' });
  });

  it('should handle SequelizeUniqueConstraintError with 400 status', () => {
    const err = {
      name: 'SequelizeUniqueConstraintError',
      errors: [{ message: 'Unique constraint error message' }]
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unique constraint error message' });
  });

  it('should handle BadRequest error with 400 status', () => {
    const err = {
      name: 'BadRequest',
      message: 'Bad request error message'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Bad request error message' });
  });

  it('should handle Unauthorized error with 401 status', () => {
    const err = {
      name: 'Unauthorized',
      message: 'Unauthorized error message'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized error message' });
  });

  it('should handle Forbidden error with 403 status', () => {
    const err = {
      name: 'Forbidden',
      message: 'Forbidden error message'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden error message' });
  });

  it('should handle NotFound error with 404 status', () => {
    const err = {
      name: 'NotFound',
      message: 'Not found error message'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found error message' });
  });

  it('should handle JsonWebTokenError with 401 status', () => {
    const err = {
      name: 'JsonWebTokenError',
      message: 'JWT error message'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('should handle unknown errors with 500 status', () => {
    const err = {
      name: 'UnknownError',
      message: 'Unknown error message'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});