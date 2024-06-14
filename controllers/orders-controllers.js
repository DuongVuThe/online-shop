const Order = require("../models/order-model");
const User = require("../models/user-model");
const stripe = require("stripe")(
  "sk_test_51OZqNfKQYabEHuGR1XS55ndlizUf7K8QIe8rqJS0pnqXa70LpetBIMWLyxKckuRfOVG4q5iOrJZpsT1AcbfiaxXq00geyWpwlW"
);

async function getOrder(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", { orders: orders });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    order.save();
  } catch (error) {
    next(error);
    return;
  }
  req.session.cart = null;

  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map(function(item) {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.title,
          },
          unit_amount: +item.product.price * 100,
        },
        quantity: item.quantity,
      }
    }),
    mode: "payment",
    success_url: "http://localhost:3000/orders/success",
    cancel_url: "http://localhost:3000/orders/failure",
  });

  res.redirect(303, session.url);
}

function getSuccess(req, res) {
  res.render("customer/orders/success");
}

function getFailure(req, res) {
  res.render("customer/orders/failure");
}

module.exports = {
  addOrder: addOrder,
  getOrder: getOrder,
  getSuccess: getSuccess,
  getFailure: getFailure,
};
