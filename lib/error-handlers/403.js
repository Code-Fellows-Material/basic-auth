'use strict';

function errorHandler(err, req, res, next){
  res.status(403).send(err);
}

module.exports = errorHandler;