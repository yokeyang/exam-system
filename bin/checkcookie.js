const md5 = require('./md5')
const sql = require('./sql')
module.exports = async (ctx,next) =>{
    try {
        ctx.user = await ctx.cookies.get('cid')
        ctx.sbj = await ctx.cookies.get('sbj')
        ctx.time = await ctx.cookies.get('time')
        ctx.sign = await ctx.cookies.get('sign')
        let psd
        if(ctx.user !== undefined){
            psd = await sql.con(`SELECT * FROM manager where user = '${ctx.user}'`)
            psd = psd[0].password
        }
        if(md5.md5decrypt(ctx.user,psd,ctx.sign)){
            await next()
        }else{
            ctx.user = ''
            await next()            
        }
    } catch (error) {
        return ctx.body = {error:error.message}
    }
}