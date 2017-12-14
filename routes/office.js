const sql = require('../bin/sql')

module.exports = (router) =>{
  router.get('/office',sql.getPager)
}