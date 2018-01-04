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
// Demonstration of multiple force acting on 
// bodies (Mover class)
// Bodies experience gravity continuously
// Bodies experience fluid resistance when in "water"

// Five moving bodies
var movers = [];

// Liquid
var liquid;

function setup() {
    createCanvas($('.outer').width(), window.displayHeight - 5);
    reset();
    // Create liquid object
    liquid = new Liquid(0, height / 2, width, height / 2, 0.1);
}

function draw() {
    background(255);

    // Draw water
    liquid.display();

    for (var i = 0; i < movers.length; i++) {

        // Is the Mover in the liquid?
        if (liquid.contains(movers[i])) {
            // Calculate drag force
            var dragForce = liquid.calculateDrag(movers[i]);
            // Apply drag force to Mover
            movers[i].applyForce(dragForce);
        }

        // Gravity is scaled by mass here!
        var gravity = createVector(0, 0.1 * movers[i].mass);
        // Apply gravity
        movers[i].applyForce(gravity);

        // Update and display
        movers[i].update();
        movers[i].display();
        movers[i].checkEdges();
    }

}


function mousePressed() {
    reset();
}

// Restart all the Mover objects randomly
function reset() {
    for (var i = 0; i < parseInt($('.outer').width()/70); i++) {
        movers[i] = new Mover(random(0.5, 3), 40 + i * 70, 0);
    }
}

var Liquid = function (x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
};

// Is the Mover in the Liquid?
Liquid.prototype.contains = function (m) {
    var l = m.position;
    return l.x > this.x && l.x < this.x + this.w &&
        l.y > this.y && l.y < this.y + this.h;
};

// Calculate drag force
Liquid.prototype.calculateDrag = function (m) {
    // Magnitude is coefficient * speed squared
    var speed = m.velocity.mag();
    var dragMagnitude = this.c * speed * speed;

    // Direction is inverse of velocity
    var dragForce = m.velocity.copy();
    dragForce.mult(-1);

    // Scale according to magnitude
    // dragForce.setMag(dragMagnitude);
    dragForce.normalize();
    dragForce.mult(dragMagnitude);
    return dragForce;
};

Liquid.prototype.display = function () {
    noStroke();
    fill(255);
    rect(this.x, this.y, this.w, this.h);
};

function Mover(m, x, y) {
    this.mass = m;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
}

// Newton's 2nd law: F = M * A
// or A = F / M
Mover.prototype.applyForce = function (force) {
    var f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
};

Mover.prototype.update = function () {
    // Velocity changes according to acceleration
    this.velocity.add(this.acceleration);
    // position changes by velocity
    this.position.add(this.velocity);
    // We must clear acceleration each frame
    this.acceleration.mult(0);
};

Mover.prototype.display = function () {
    stroke(0);
    strokeWeight(2);
    fill(255, 127);
    ellipse(this.position.x, this.position.y, this.mass * 16, this.mass * 16);
};

// Bounce off bottom of window
Mover.prototype.checkEdges = function () {
    if (this.position.y > (height - this.mass * 8)) {
        // A little dampening when hitting the bottom
        this.velocity.y *= -0.9;
        this.position.y = (height - this.mass * 8);
    }
};