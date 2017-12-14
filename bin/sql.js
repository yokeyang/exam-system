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
function con(user){
    return new Promise(resolve=>{
        pool.getConnection((err, connection) => {
            connection.query(`SELECT * FROM manager where user = '${user}'`, (error, results, fields) => {
                resolve(results[0].password)
                if (error) throw error;
            })
        })
    })
} 
exports.checkLogin = async (ctx,next) =>{
    try {
        let user = ctx.request.body.user,
            psd = ctx.request.body.psd
        var cpsd = '11'
        cpsd = await con(user)
        if (cpsd === psd){
            await next()
        }else{
            return ctx.body = {error:true}
        }
    } catch (error) {
        return ctx.body = error.message
    }
}

const formidable = require("formidable")


function con2(sql) {
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
exports.checkPaper = async (ctx,next) =>{
    try {
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
            await con2(`INSERT INTO paper (name,sbj,time,file,note) values ('${data.name}','${data.sbj}','${data.time}','${data.file}','${data.notes}')`)
            if (err) { throw err; return; }
        })
        await next()
    } catch (error) {
        return ctx.body = error.message        
    }
}

exports.getPager = async (ctx,next) =>{
    try {
        let data = await con2(`select * from paper`)
        await ctx.render('office',{
            datas:data
        })
    } catch (error) {
        return ctx.body = error.message
    }}