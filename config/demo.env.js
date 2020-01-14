'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"demo"',
  BASE_API: '"https://demo-ads.xinchao.com"'
})
