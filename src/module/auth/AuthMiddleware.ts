import { Context, Next } from "koa";
import jwt from "jsonwebtoken";
import AuthModule from "./AuthModule";

const AuthMiddleware = function () {
  return async function (ctx: Context, next: Next) {
    // check access. every request needs access.
    // otherwise send error json
    // error json will lead client to open login page
    let jwtString = ctx.cookies.get("token");
    if (jwtString) {
      await AuthModule.checkAuth(jwtString);
      await AuthModule.addUserData(ctx, jwtString);
      await next();
    } else {
      ctx.body = {
        success: false,
        needsLogin: true,
        message: "not authorized"
      };
    }
  };
};

export default AuthMiddleware;
