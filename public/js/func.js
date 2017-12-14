'use strict'

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
            if(data.error){
                alert("username or password error")
                return
            }
            console.log('ok')
            window.location.href = '/teacher'
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
                url: '/paper',
                processData: false,
                contentType: false,
                data: formData
            }).done((data) => {
                console.log('ok')
                if (data.error) {
                    alert("username or password error")
                    return
                }
                console.log('ok')
            })
        }
    })
}