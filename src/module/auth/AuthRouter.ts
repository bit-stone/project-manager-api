import Router from "@koa/router";
import AuthModule from "./AuthModule";

const router = new Router({ prefix: "/auth" });

router.get("/ping", async (ctx, next) => {
  const token = ctx.cookies.get("token");
  if (token) {
    await AuthModule.checkAuth(token);
    const userData = await AuthModule.getUserData(token);
    console.log(userData);
    ctx.body = {
      success: true,
      message: "",
      data: userData
    };
  } else {
    ctx.body = {
      success: false,
      needsLogin: true,
      message: "not authorized"
    };
  }
});

router.post("/login", async (ctx, next) => {
  try {
    let data = ctx.request.body;
    await AuthModule.checkLogin(ctx, data.loginName, data.password);
  } catch (e) {
    console.log(e);
    ctx.body = {
      success: false,
      message: e.message
    };
  }
});

router.post("/logout", async (ctx, next) => {
  ctx.cookies.set("token", null);
  ctx.body = {
    success: true
  };
});

export default router;
