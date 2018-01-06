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

  router.post('/office',checkcookie,sql.delpaper,async (ctx,next) => {
    ctx.body = {error:false}
  })

  router.post('/office/chginfo', checkcookie,sql.chginfo, async (ctx, next) => {
    console.log(ctx.user)
    ctx.body = { error: false }
  })

}
