module.exports = async (ctx,next) =>{
    try {
        ctx.user = await ctx.cookies.get('cid'),
        ctx.sbj = await ctx.cookies.get('sbj'),
        ctx.time = await ctx.cookies.get('time')
        await next()        
    } catch (error) {
        return ctx.body('not login in')
    }
}