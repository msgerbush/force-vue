const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
<<<<<<< HEAD
  NODE_ENV: '"development"'
=======
  NODE_ENV: '"development"',
>>>>>>> add-environment-support
});
