// auth/token.service.js
import jwt from "jsonwebtoken";

export class TokenService {
  constructor(config) {
    if (!config) {
      throw new Error("TokenService requires config");
    }

    this.accessTokenSecret = config.ACCESS_TOKEN_SECRET;
    this.refreshTokenSecret = config.REFRESH_TOKEN_SECRET;

    this.accessTokenTTL = config.ACCESS_TOKEN_TTL || "10m";
    this.refreshTokenTTL = config.REFRESH_TOKEN_TTL || "7d";

    this.issuer = config.TOKEN_ISSUER || "auth-service";
  }

  createAccessToken(payload) {
    return jwt.sign(
      {
        ...payload,
        typ: "access",
      },
      this.accessTokenSecret,
      {
        expiresIn: this.accessTokenTTL,
        issuer: this.issuer,
      }
    );
  }

  createRefreshToken(payload) {
    return jwt.sign(
      {
        ...payload,
        typ: "refresh",
      },
      this.refreshTokenSecret,
      {
        expiresIn: this.refreshTokenTTL,
        issuer: this.issuer,
      }
    );
  }
}
