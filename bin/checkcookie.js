module.exports = async (ctx,next) =>{
    let a = ctx.cookies.get('cid'),
        b = ctx.cookies.get('sbj'),
        c = ctx.cookies.get('time')
    console.log(a)
    await ctx.render('teacher', {
        user: a,
        sbj: b,
        time: c
    })
}