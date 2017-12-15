const sql = require('../bin/sql')
const checkcookie = require('../bin/checkcookie')
module.exports = (router) =>{
  router.get('/office',checkcookie,sql.getPager,async (ctx,next)=>{
    await ctx.render('office', {
      user: ctx.user,
      sbj: ctx.sbj,
      time: ctx.time,
      datas: ctx.datas
    })
  })

  router.post('/delpaper',sql.delpaper,async (ctx,next) => {
    ctx.body = {error:false}
  })
}