// Этот файл отвечает за "красоту" на сайте - иконочки, динамичный фон и так далее

var LOADED = false;
var LOADING = false;
var OLD_HEIGHT = 0;
var OLD_WIDTH = 0;
var json = {};
var oldi = 0; var oldk = 0

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function makeBG() {
  $.getJSON("http://127.0.0.1:5656/goods.json", function(jsonl){
    LOADED = true;
    json = jsonl;
    render();
  });
}

function render() {
  if (!LOADED || LOADING) {
    return;
  }
  console.log(json)
  var img_size = 92;

  let resistors =  document.getElementById("pictors");
  if (resistors.children.length == 0) {
    //resistors.replaceChildren();
    let base_pic = getRandom(1, json["goods"].length-5);
    for (let j = base_pic; j < base_pic + 5; j++) {
      let pic = json["goods"][j]["icon"];
      let img = document.createElement("img");
      img.setAttribute("width", img_size);
      img.setAttribute("src", pic);
      resistors.appendChild(img);
    }
  }

  let width = $(document).width();
  let height = $(document).height();

  if ((OLD_HEIGHT <= height) || (OLD_WIDTH <= width)) {
    LOADING = true;
    console.log("Ширина: ", width, OLD_WIDTH);
    console.log("Высота: ", height, OLD_HEIGHT);
    console.log("Прорабатываем фон");
    console.log("Количество товаров: ", json["goods"].length);
  
    let bg = document.getElementById("bg");
    //bg.replaceChildren();
    for (let i = 0; i <= Math.floor(height/img_size); i++) {
      let row = 0;
      let row_exists = (i < oldi);
      if (row_exists) {
        row = document.getElementsByClassName("bgrow")[i];
      } else {
        row = document.createElement("div");
        row.setAttribute("class", "bgrow");
      }
      var k = 0;
      if (row_exists) {
        k = oldk;
      }
      for (; k <= Math.floor(width/img_size); k++) {
        let pic = json["goods"][getRandom(1, json["goods"].length)]["icon"];
        let img = document.createElement("img");

        img.setAttribute("src", pic);
        img.setAttribute("height", img_size);

        let element = document.createElement("div");

        element.setAttribute("class", "bgtile");

        let colortile = document.createElement("div");
        colortile.setAttribute("style", "height: 100%; width: " +
          Math.ceil(img_size/2) + "px;");
        colortile.setAttribute("width", Math.ceil(img_size/2));

        element.appendChild(img);
        element.appendChild(colortile);

        row.append(element);
      }
      if (!row_exists) {
        bg.append(row);
      }
    }
    oldi = Math.floor(height/img_size) + 1;
    oldk = Math.floor(width/img_size) + 1;
    OLD_HEIGHT = height; OLD_WIDTH = width;
    LOADING = false;
    LOADED = true;
  }
}

function goto(page) {
  window.location = page;
}

document.addEventListener("DOMContentLoaded", makeBG);
document.addEventListener('resize', render, true);
window.addEventListener('resize', render, true);

