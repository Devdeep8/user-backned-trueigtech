const responseMiddleware = (req, res, next) => {
  const originalJson = res.json.bind(res);
  
  res.json = function (payload = {}) {
    const isError = Boolean(payload?.error);
    
    if (isError) {
      const statusCode = payload.error.statusCode || 500;
      res.status(statusCode);
    }
    
    const responseBody = {
      success: !isError,
      ...(isError
        ? { error: payload.error }
        : { data: payload.data ?? payload }),
      ...(payload.meta ? { meta: payload.meta } : {}),
    };
    
    
    return originalJson(responseBody);
  };

  next();
};

export default responseMiddleware;
