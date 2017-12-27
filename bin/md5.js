exports.md5encrypt = (content1,content2) =>{
    const crypto = require('crypto')
    const md5 = crypto.createHash("md5")
    let str = "content1 =" + content1 + "content2 =" + content2
    md5.update(str);
    return md5.digest('hex');
}
exports.md5decrypt = (content1, content2,sign) =>{
    const crypto = require('crypto')
    const md5 = crypto.createHash("md5")
    let verifysign = crypto.createHash('md5').update("content1 =" + content1 + "content2 =" + content2, 'utf8').digest("hex")
    if(sign === verifysign){
        return true
    }else{
        return false
    }
}