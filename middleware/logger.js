const logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`.green);
    next();
  };


  module.exports = logger