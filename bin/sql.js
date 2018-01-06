'use strict'
const mysql = require('mysql')
const fs = require('fs')
const md5 = require('./md5')
// 创建数据池
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '218906',
    database: 'exam'
})
function con(sql) {
    return new Promise(resolve => {
        // pool.getConnection((err, connection) => {
            pool.query(sql, (error, results, fields) => {
                resolve(results)
                if (error) throw error;
            })
        // }) 
    })
}
exports.con = con

exports.checkLogin = async (ctx,next) =>{
    try {
        let url = ctx.request.header.referer
        url = url.replace(/http:\/\/\w+:[0-9]+\//, '')
        ctx.referer = '/' + url
        let user = ctx.request.body.user,
            psd = ctx.request.body.psd
        var cpsd = ''
        let result = await con(`SELECT * FROM manager where user = '${user}'`)
        cpsd = result[0].password
        if(url === 'teacher'){
            console.log(cpsd,psd)
            if (cpsd === psd){
                ctx.sign = md5.md5encrypt(user,psd)
                await next()
            }else{
                return ctx.body = {error:'password error'}
            }
        }else{
            let om = result[0].om
            if (cpsd === psd && om) {
                ctx.sign = md5.md5encrypt(user, psd)                
                await next()
            } else {
                return ctx.body = { error: 'your not manager' }
            }
        }
    } catch (error) {
        return ctx.body = error.message
    }
}

exports.delpaper = async (ctx,next) =>{
    try {
        if (ctx.user === '' || ctx.user === undefined) {
            return ctx.body = { error: 'not login' }
        }
        let id = ctx.request.body.id
        let result = await con(`delete from paper where id = '${id}'`)        
        await next()
    } catch (error) {
        return ctx.body = {error:error.message}
    }
}

exports.chginfo = async (ctx,next) =>{
    try {
        if (ctx.user === '' || ctx.user === undefined) {
            return ctx.body = { error: 'not login' }
        }
        let id = ctx.request.body.id
        for (let data in ctx.request.body){
            if (data !== 'id'){
                console.log(data)
                await con(
                    `update paper set ${data} = '${ctx.request.body[data]}' where id = ${id}`
                )
            }
        }
        await next()
    } catch (error) {
        return ctx.body = { error: error.message }
    }
}

const formidable = require("formidable")

exports.checkPaper = async (ctx,next) =>{
    try {
        console.log(`sql${ctx.user}`)
        if (ctx.user === '' || ctx.user === undefined) {
            console.log('checkpaper')
            return ctx.body = {error:'not login'}
        }
        let form = new formidable.IncomingForm()
        form.parse(ctx.req, async function (err, fields, files) {
            let data = fields
            data.file = files.file.name
            console.log(files.file.name)
            fs.copyFile(files.file.path, `public/${files.file.name}`, (err)=>{
                if (err) {
                    return console.error(err);
                }
            })
            await con(`INSERT INTO paper (name,sbj,time,file,note) values ('${data.name}','${data.sbj}','${data.time}','${data.file}','${data.notes}')`)
            if (err) { throw err; return; }
        })
        await next()
    } catch (error) {
        return ctx.body = error.message        
    }
}
exports.getPager = async (ctx,next) =>{
    try {
        ctx.datas = await con(`select * from paper`)
        await next()
    } catch (error) {
        return ctx.body = error.message
    }
}

exports.changePsd = async (ctx,next) =>{
    try {
        let psd1 = ctx.request.body.psd1
        let psd2 = ctx.request.body.psd2        
        if (psd1 !== psd2){
            return ctx.body({ error:'Inconsistencies password and confirm password!'})
        }
        await con(`update manager set password='${psd1}' where user='${ctx.request.body.user}'`)
        await next()
    } catch (error) {
        return ctx.body = error.message
    }
}