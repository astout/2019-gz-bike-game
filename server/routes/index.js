require('module-alias/register');
const fs = require('fs');
const validFileTypes = ['js'];

const requireFiles = (directory, RouteConfig) => {
  fs.readdirSync(directory).forEach((file) => {
    // Recurse if directory
    if (fs.lstatSync(directory + '/' + file).isDirectory()) {
      requireFiles(directory + '/' + file, RouteConfig);
    } else {

      // Skip this file
      if (file === 'index.js' && directory === __dirname) return;

      // Skip unknown filetypes
      if (validFileTypes.indexOf(file.split('.').pop()) === -1) return;

      // Require the file.
      require(directory + '/' + file)(RouteConfig);
    }
  });
};

// module.exports = (RouteConfig) => {
//   // require all API endpoints
//   fs.readdirSync(`${__dirname}/api/`).forEach((file) => {
//     require(`./api/${file.substr(0, file.indexOf('.'))}`)(app);
//   });
// };

module.exports = (RouteConfig) => {
  requireFiles(`${__dirname}/api/`, RouteConfig);
};
