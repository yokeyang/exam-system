const router = require('koa-router')()
const KoaBody = require('koa-body')
const sql = require('../bin/sql')
const checkcookie = require('../bin/checkcookie')
router.get('/', checkcookie, async (ctx, next) => {
  await ctx.redirect('/teacher')
})
router.get('/teacher',checkcookie, async (ctx, next) => {
  await ctx.render('teacher', {
    user: ctx.user,
    sbj: ctx.sbj,
    time: ctx.time
  })
})

router.post('/change',sql.checkLogin,sql.changePsd,async (ctx,next)=>{
  ctx.body = { error: false }
})

router.post('/login',sql.checkLogin, async (ctx, next) => {
  try {
    ctx.cookies.set(
      'cid',
      ctx.request.body.user,
      {
        domain: 'localhost',  // 写cookie所在的域名
        maxAge: 10 * 60 * 1000, // cookie有效时长
        path: ctx.referer,
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: true  // 是否允许重写
      }
    )
    ctx.cookies.set(
      'sign',
      ctx.sign,
      {
        domain: 'localhost',  // 写cookie所在的域名
        maxAge: 10 * 60 * 1000, // cookie有效时长
        path: ctx.referer,
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: true  // 是否允许重写
      }
    )
    ctx.cookies.set(
      'sbj',
      'algorithm',
      {
        domain: 'localhost',  // 写cookie所在的域名
        maxAge: 10 * 60 * 1000, // cookie有效时长
        path: ctx.referer,        
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: true  // 是否允许重写
      }
    )
    ctx.cookies.set(
      'time',
      'mid',
      {
        domain: 'localhost',  // 写cookie所在的域名
        maxAge: 10 * 60 * 1000, // cookie有效时长
        path: ctx.referer,        
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: true  // 是否允许重写
      }
    )
    return ctx.body = {error:false}
  } catch (error) {
    return ctx.body = error.message
  }
})
router.post('/teacher',checkcookie, sql.checkPaper, async (ctx, next) => {
  ctx.body = {error:false}
})

require('./office')(router)

module.exports = router
