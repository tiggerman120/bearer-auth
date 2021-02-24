'use strict';

module.exports = (req,res,next) => {
  let error = { error: 'No front end to display on this application' };
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error));
  res.end();
};