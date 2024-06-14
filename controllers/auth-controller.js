const User = require("../models/user-model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignUp(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      name: "",
      street: "",
      post: "",
      city: "",
    };
  }
  res.render("customer/auth/signup", { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    name: req.body.fullname,
    street: req.body.street,
    post: req.body.postal,
    city: req.body.city,
  };
  if (
    !validation.validateInput(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city ||
        !validation.sameConfirmedEmail(
          req.body.email,
          req.body["confirm-email"]
        )
    )
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "Please check your input!",
        ...enteredData,
      },
      function () {
        res.redirect("signup");
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    const existAlready = await user.emailExist();
    if (existAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User already exists!",
          ...enteredData,
        },
        function () {
          res.redirect("signup");
        }
      );
      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }
  res.redirect("/login");
}

function getLogIn(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("customer/auth/login", {inputData: sessionData});
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserFromEmail();
  } catch (error) {
    next(error);
    return;
  }
  const sessionData = {
    errorMessage: "Wrong email or password! Please check your input!",
    email: user.email,
    password: user.password,
  };
  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionData, function () {
      res.redirect("login");
    });
    return;
  }

  const passwordCheck = await user.hasMatchingPassword(existingUser.password);

  if (!passwordCheck) {
    sessionFlash.flashDataToSession(req, sessionData, function () {
      res.redirect("login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/");
}

module.exports = {
  getSignUp: getSignUp,
  getLogIn: getLogIn,
  signup: signup,
  login: login,
  logout: logout,
};
