const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err.name);
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
  }

  return res.status(statusCode).json({
    error: {
      message: err.message || "Something went wrong",
      code: err.code || "INTERNAL_ERROR",
      type: err.type || "SERVER_ERROR",
      statusCode: statusCode,
    },
    meta: {
      service: err.service || "UnknownService",
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
    },
  });
};

export default errorHandler;
