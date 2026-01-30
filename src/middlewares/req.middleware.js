const reqMiddleware = async (req, res, next) => {
  try {
    const METHODS_WITH_BODY = ["POST", "PUT", "PATCH", "DELETE"];

    console.log(req.originalUrl);

    // Skip GET and others
    if (!METHODS_WITH_BODY.includes(req.method)) {
      return next();
    }

    const contentType = req.headers["content-type"];
    if (!contentType) {
      return res.status(415).json({
        message: "Content-Type header is required",
      });
    }

    if (!contentType.includes("application/json")) {
      return res.status(415).json({
        message: "Only application/json is allowed",
        received: contentType,
      });
    }

    // ------------------------
    // 1️⃣ Body existence check
    // ------------------------
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is required",
      });
    }

    // ------------------------
    // 2️⃣ CSP (Content Security Policy)
    // ------------------------
    // console.log()
    // res.setHeader(
    //   "Content-Security-Policy",
    //   "default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self';",
    // );

    // // ------------------------
    // // 3️⃣ SQL Injection patterns
    // // ------------------------
    // const sqlInjectionRegex =
    //   /(\b(select|insert|update|delete|drop|truncate|alter)\b)|(--|;|'|"|\/\*|\*\/|\bOR\b|\bAND\b)/gi;

    // // ------------------------
    // // 4️⃣ XSS patterns
    // // ------------------------
    // const xssRegex =
    //   /(<script.*?>.*?<\/script>)|(<.*?on\w+=.*?>)|javascript:/gi;

    // // ------------------------
    // // 5️⃣ Deep scan body values
    // // ------------------------
    // const scanObject = (obj) => {
    //   for (const key in obj) {
    //     const value = obj[key];
    //     console.log(value, "first");

    //     if (typeof value === "string") {
    //       if (sqlInjectionRegex.test(value)) {
    //         throw {
    //           status: 400,
    //           message: "Potential SQL Injection detected",
    //           field: key,
    //         };
    //       }

    //       if (xssRegex.test(value)) {
    //         throw {
    //           status: 400,
    //           message: "Potential XSS attack detected",
    //           field: key,
    //         };
    //       }
    //     }

    //     if (typeof value === "object" && value !== null) {
    //       console.log(value, "recursion check");

    //       scanObject(value); // recursive check
    //     }
    //   }
    // };

    // scanObject(req.body);

    // ✅ Passed all checks
    next();
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Security validation failed",
      field: err.field || null,
    });
  }
};

export default reqMiddleware;
