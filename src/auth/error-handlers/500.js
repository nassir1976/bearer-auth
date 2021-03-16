'use strict';

module.exports = (err, req, res, next) => {
  let error = { error: err.message || err };
  res.statusCode = err.status || 500;
  res.statusMessage = err.statusMessage || 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error));
  res.end();
};

// 'use strict';

// function errorHandler (err, req, res, next){
//   res.status(500).send( 'broke for some reason');
// }

// module.exports = errorHandler;
