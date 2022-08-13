module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) next();
};

module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.membershipstatus === admin) {
    next();
  }
};
