
async function updateCartPrices(req, res, next) {
  const cart = res.locals.cart;

  await cart.updatePrice();
  next();
}

module.exports = updateCartPrices;