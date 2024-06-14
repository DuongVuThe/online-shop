const deleteButtonElements = document.querySelectorAll(".product-item button");

async function deleteProduct(event) {
  const buttonElement = event.target;
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf;

  await fetch("/admin/products/" + productId + "?_csrf=" + csrfToken, {
    method: "DELETE",
  });

  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteButtonElement of deleteButtonElements) {
  deleteButtonElement.addEventListener("click", deleteProduct);
}
