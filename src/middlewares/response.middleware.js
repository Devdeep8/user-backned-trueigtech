const responseMiddleware = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    // Check if the service returned extra info
    const meta = data?.meta || {};
    const serviceName = meta.service || req.serviceName || "UnknownService";
    const executionTime = meta.executionTime || null;

    const responseBody = {
      success: true,
      requestId: req.requestId || null,
      timestamp: new Date().toISOString(),
      data: data.data || data, // support raw data or {data, meta}
      meta: {
        service: serviceName,
        executionTime,
      },
    };


    return originalJson.call(this, responseBody);
  };

  next();
};

export default responseMiddleware;
