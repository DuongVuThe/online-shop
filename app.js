const express = require("express");
const path = require("path");
const csrf = require("csurf");
const expressSession = require("express-session");

const authRoutes = require("./routes/auth-routes");
const productRoutes = require("./routes/product-routes");
const baseRoutes = require("./routes/base-routes");
const adminRoutes = require("./routes/admin-routes");
const cartRoutes = require("./routes/cart-routes");
const ordersRoutes = require("./routes/orders-routes");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/crsf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const protectAdminRoutesMiddleware = require("./middlewares/protect-admin-routes");
const cartMiddleware = require("./middlewares/cart");
const updateCartPrices = require("./middlewares/update-cart-price");
const notFoundHandlerMiddleware = require("./middlewares/not-found");
const createSessionConfig = require("./config/session");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(cartMiddleware);
app.use(updateCartPrices);

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(productRoutes);
app.use(authRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", protectRoutesMiddleware, ordersRoutes);
app.use("/admin", protectRoutesMiddleware, protectAdminRoutesMiddleware, adminRoutes);
app.use(notFoundHandlerMiddleware);
app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then()
  .catch(function (error) {
    console.log("Failed to connect to database!");
    console.log(error);
  });
app.listen(3000);
