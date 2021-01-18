import { Context } from "koa";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { config } from "../../config";
import UserModel from "./UserModel";

class AuthModule {
  async checkAuth(jwtString: string) {
    await jwt.verify(jwtString, config.jwt.secret);
  }

  async checkLogin(ctx: Context, loginName: string, password: string) {
    if (loginName.length && password.length) {
      let user = await UserModel.findOne({
        loginName: loginName
      });

      if (!user) {
        throw Error("invalid login name or password");
      }

      let result = await bcrypt.compare(password, user.pwHash);
      if (!result) {
        throw Error("invalid login name or password");
      }

      // create jwt
      let tokenString = jwt.sign(
        {
          userId: user._id
        },
        config.jwt.secret
      );

      // set it as a cookie
      ctx.cookies.set("token", tokenString);

      // done?
      ctx.body = {
        success: true,
        message: "",
        data: await this.getUserData(tokenString)
      };
    } else {
      throw Error("invalid login name or password");
    }
  }

  async addUserData(ctx: Context, jwtString: string) {
    let data = await jwt.decode(jwtString);
    ctx.auth = data;
  }

  async getUserData(jwtString: string) {
    const data: any = await jwt.decode(jwtString);
    if (data && data["userId"]) {
      const userList = await UserModel.find();

      const userNameList = {} as {
        [key: string]: {
          displayName: string;
          loginName: string;
        };
      };

      for (let user of userList) {
        userNameList[user._id] = {
          displayName: user.displayName,
          loginName: user.loginName
        };
      }

      return {
        userId: data["userId"],
        userNameList: userNameList
      };
    }
  }

  async addLogin(userId: string, jwtString: string) {
    console.log("new login: ", userId, jwtString);
  }
}

export default new AuthModule();
