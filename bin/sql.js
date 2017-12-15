'use strict'
const mysql = require('mysql')
const fs = require('fs')
// 创建数据池
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'yang218906',
    database: 'exam'
})
function con(sql) {
    return new Promise(resolve => {
        pool.getConnection((err, connection) => {
            connection.query(sql, (error, results, fields) => {
                console.log("ok")
                resolve(results)
                if (error) throw error;
            })
        })
    })
}

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
            if (cpsd === psd){
                await next()
            }else{
                return ctx.body = {error:true}
            }
        }else{
            let om = result[0].om
            if (cpsd === psd && om) {
                await next()
            } else {
                return ctx.body = { error: true }
            }
        }
    } catch (error) {
        return ctx.body = error.message
    }
}

exports.delpaper = async (ctx,next) =>{
    try {
        let id = ctx.request.body.id
        let result = await con(`delete from paper where id = '${id}'`)        
        await next()
    } catch (error) {
        return ctx.body = {error:true}
    }
}

const formidable = require("formidable")
exports.checkPaper = async (ctx,next) =>{
    try {
        if (ctx.user === '' || ctx.user === undefined) {
            return ctx.body = {error:true}
        }
        let form = new formidable.IncomingForm()
        form.parse(ctx.req, async function (err, fields, files) {
            let data = fields
            data.file = files.file.name
            console.log(files.file.path)
            fs.copyFile(files.file.path, `public/${files.file.name}`, (err)=>{
                if (err) {
                    return console.error(err);
                }
            })
            console.log(data.name)
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
    }}