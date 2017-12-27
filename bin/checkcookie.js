module.exports = async (ctx,next) =>{
    try {
        ctx.user = await ctx.cookies.get('cid'),
        ctx.sbj = await ctx.cookies.get('sbj'),
        ctx.time = await ctx.cookies.get('time')
        console.log(ctx.user)
        await next()        
    } catch (error) {
        console.log(error.message)
        return ctx.body('not login in')
    }
}