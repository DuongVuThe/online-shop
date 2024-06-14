function isEmpty(value) {
  return !value || value.trim() === "";
}

function validateInput(email, password, name, street, postal, city) {
  return (
    email &&
    email.includes("@") &&
    password &&
    password.trim().length > 5 &&
    !isEmpty(name) &&
    !isEmpty(street) &&
    !isEmpty(postal) &&
    !isEmpty(city)
  );
}

function sameConfirmedEmail(email, confirmedEmail) {
  return email === confirmedEmail;
}

module.exports = {
  validateInput: validateInput,
  sameConfirmedEmail: sameConfirmedEmail
};
