'use strict'

let delpaper = (id) => {
    $.ajax({
        type: 'post',
        url: '/office',
        dataType: 'json',
        data: { id: id }
    }).done((data) => {
        if (data.error.length) {
            alert(data.error)
            return
        }
        alert("delete success")
        window.location.reload(true)
    })
}

let chginfo = (id) => {
    let f = `#changeinfo${id}`,
        sbj = $(f + ` #chgsbj`).val(),
        name = $(f + ` #chgname`).val(),
        time = $(f + ` #chgtime`).val(),
        note = $(f + ` #chgnotes`).val()
    $.ajax({
        type: 'post',
        url: '/office/chginfo',
        dataType: 'json',
        data: { id:id,sbj:sbj,name:name,time:time,note:note }
    }).done((data) => {
        console.log('ok')
        if (data.error.length) {
            alert(data.error)
            return
        }
        console.log('ok')
        window.location.reload(true)
    })
}

window.onload = ()=>{
    $('#btn-login').click(()=>{
        let user = $('#username').val(),
            psd = $('#password').val()
        $.ajax({
            type: 'post',
            url: '/login',
            dataType: 'json',
            data: { user: user, psd: psd }
        }).done((data) => {
            console.log('ok')
            if(data.error.length){
                alert(data.error)
                return
            }
            console.log('ok')
            window.location.reload(true)
        })
    })
    $('#btn-chgpsd').click(() => {
        let user = $('#username1').val(),
            psd = $('#psd').val(),
            psd1 = $('#psd1').val(),
            psd2 = $('#psd2').val()                         
        $.ajax({
            type: 'post',
            url: '/change',
            dataType: 'json',
            data: { user: user, psd: psd, psd1:psd1, psd2:psd2 }
        }).done((data) => {
            if (data.error.length > 0) {
                console.log(data.error)
                alert(data.error)
                return
            }
            console.log('ok')
            window.location.reload(true)
        })
    })
    $('#sbj').change(function(){
        $('#input-sbj').val(this.value)
        console.log(this.value)
    })
    $('#time').change(function () {
        $('#input-time').val(this.value)
        console.log(this.value)
    })
    $('.breadcrumb a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
        console.log($(this))
    })
    $('#btn-post').click(()=>{
        let formData = new FormData()
        let name = $('#input-name').val()
        let sbj = $('#input-sbj').val()
        let time = $('#input-time').val()
        let file = $('#input-file')[0].files[0]
        console.log(file)
        let notes = $('#notes').val()
        formData.append('name', name)
        formData.append('sbj', sbj)
        formData.append('time', time)
        formData.append('file', file)
        formData.append('notes', notes)
        if(name === '' || name === undefined ||
            sbj === '' || sbj === undefined ||
            time === '' || time === undefined ||
            file === '' || file === undefined
        ){
            alert('please fill the input') 
        }else{
            $.ajax({
                type: 'post',
                url: '/teacher',
                processData: false,
                contentType: false,
                data: formData
            }).done((data) => {
                if (data.error.length > 0) {
                    alert(data.error)
                    window.location.reload(true)
                    return
                }
                window.location.reload(true)
            })
        }
    })
}