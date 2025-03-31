const bcrypt = require("bcryptjs");
const User = require("../models/user");

const localSignupStrategy = (req, email, password, done) => {
  if (email) {
    email = email.toLowerCase();
  }
  process.nextTick(() => {
    if (!req.user) {
      User.findOne({ email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, { message: "User already registered" });
        } else {
          bcrypt.genSalt(10, (errC, salt) => {
            bcrypt.hash(password, salt, (errCrypt, res) => {
              const newUser = {
                email,
                password: res,
              };
              User.create(newUser, (rErr, rUser) => {
                if (rErr) {
                  return done(rErr);
                }

                return done(null, rUser);
              });
            });
          });
        }
      });
    } else if (!req.user.email) {
      User.findOne({ email }, (err, rUser) => {
        if (err) {
          return done(err);
        }
        if (rUser) {
          return done(null, false);
        } else {
          bcrypt.genSalt(10, (errC, salt) => {
            bcrypt.hash(password, salt, (errCrypt, res) => {
              const newUser = req.user;

              newUser.email = email;
              newUser.password = res;

              User.create(newUser, (rErr, rUser2) => {
                if (err) {
                  return done(err);
                }

                return done(null, rUser2);
              });
            });
          });
        }
      });
    } else {
      return done(null, req.user);
    }
  });
};

const localSigninStrategy = (req, email, password, done) => {
  if (email) {
    email = email.toLowerCase();
  }

  process.nextTick(() => {
    User.findOne({ email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      bcrypt.compare(password, user.password, (errC, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  });
};

module.exports.localSignupStrategy = localSignupStrategy;
module.exports.localSiginStrategy = localSigninStrategy;
