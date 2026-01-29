import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { getCookie } from "hono/cookie";

import authRoutes from "./routes/auth.routes.js";
import walletRoutes from "./routes/budget-manager/wallets.routes.js";
import transactionRoutes from "./routes/budget-manager/transactions.routes.js";
import categoriesRoutes from "./routes/budget-manager/categories.routes.js";
import settingsRoutes from "./routes/budget-manager/userSettings.routes.js";

const app = new Hono().basePath("/api/v1");

app.use(
  "*",
  cors({
    origin: (origin, c) => {
      const originConfig = c.env.CORS_ORIGINS || "";
      const allowedOrigins = originConfig.split(",").map((s) => s.trim());
      return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    },
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

const auth = async (c, next) => {
  const secret = c.env.JWT_SECRET;
  const token = getCookie(c, "authToken");

  if (!token) {
    return c.json({ error: "Unauthorized", message: "No cookie" }, 401);
  }

  try {
    const middleware = jwt({
      secret: secret,
      cookie: "authToken",
      alg: "HS256",
    });
    return await middleware(c, next);
  } catch (err) {
    return c.json({ error: "Unauthorized", detail: err.message }, 401);
  }
};

app.onError((err, c) => {
  console.error("Hono Error:", err.name, err.message);
  if (
    err.name === "JwtTokenInvalid" ||
    err.name === "JwtTokenExpired" ||
    err.message === "Unauthorized"
  ) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return c.json(
    {
      error: "Internal Server Error",
      message: err.message,
    },
    500,
  );
});

app.use("/auth/me", auth);
app.route("/auth", authRoutes);

app.use("/wallets/*", auth);
app.use("/transactions/*", auth);
app.use("/categories/*", auth);
app.use("/settings/*", auth);

app.route("/wallets", walletRoutes);
app.route("/transactions", transactionRoutes);
app.route("/categories", categoriesRoutes);
app.route("/settings", settingsRoutes);

export default app;
