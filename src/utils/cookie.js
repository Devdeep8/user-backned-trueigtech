export const setAccessTokenCookie = (res, token) => {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
};
export const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/", // allow sending to all endpoints
  });
};


export const clearAuthCookies = (res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken", { path: "/" }); // match the cookie path
};




export function ttlToMs(ttl) {
  const unit = ttl.slice(-1); // last character: d, h, m, s
  const value = parseInt(ttl.slice(0, -1)); // number part

  switch (unit) {
    case 'd':
      return value * 24 * 60 * 60 * 1000; // days to ms
    case 'h':
      return value * 60 * 60 * 1000; // hours to ms
    case 'm':
      return value * 60 * 1000; // minutes to ms
    case 's':
      return value * 1000; // seconds to ms
    default:
      throw new Error('Invalid TTL format');
  }
}

