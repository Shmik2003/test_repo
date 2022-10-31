var json = JSON.parse("{}");
var cart = new Map();
var LOADED = false;

function makeProducts() {
  $.getJSON("http://127.0.0.1:5656/goods.json", function(jsonl){
    LOADED = true;
    json = jsonl;
    for (let i = 0; i < json["goods"].length; i++) {
      json["goods"]["id"] = i;
    }
    rerender_cart();
    render_products();
  });
}

function niceprice(price) {
  price = price.toString();
  for (let i = price.length % 3, k = 0; i < price.length; i = i + 3) {
    index = i + k;
    price = price.slice(0, index) +
      " " + price.slice(index, price.length+1);
    k++;
  }
  return price;
}


function render_products() {
  let catalog = document.getElementById("catalog");
  for (let i = 0; i < json["goods"].length; i++) {
    let product = json["goods"][i];
    let tile = document.createElement("div");
    tile.setAttribute("class", "cool_block animated productile");

    let img = document.createElement("img");
    img.setAttribute("src", product["icon"]);
    img.setAttribute("class", "animated");

    let title = document.createElement("p");
    title.setAttribute("class", "name");
    title.textContent = product["name"];

    let price = document.createElement("p");
    price.setAttribute("class", "price");
    price.textContent = product["price"] + "₽";

    let button = document.createElement("div");
    button.setAttribute("class", "cool_block animated buybutt");
    let a = document.createElement("a");
    a.textContent = "Купить!";
    button.setAttribute("onclick", "add_to_cart(" + i + ", +1);");
    button.append(a);

    tile.append(img);
    tile.append(title);
    tile.append(price);
    tile.append(button);

    catalog.appendChild(tile);
  }
}

function add_to_cart(id, count) {
  console.log("Добавляем продукт по ID:", id);
  console.log("И это:", json["goods"][id]["name"], id in cart);

  if (id in cart) {
    cart[id] = cart[id] + count;
    if (cart[id] == 0) {
      delete cart[id];
      cart.size = cart.size - 1;
    }
  } else {
    cart[id] = count;
      cart.size = cart.size + 1;
  }
  console.log("Кол-во товара:", cart[id]);

  rerender_cart();
}

function rerender_cart() {
  console.log("Рендерю список покупок");

  let cart_widg = document.getElementById("cart");
  cart_widg.replaceChildren();

  let keys = Object.keys(cart);
  console.log("Прохожусь по предметам к покупке. Список:", keys);
  let total_price = 0;
  for (let i = 0; i < keys.length; i++) {
    let product = keys[i];
    console.log("Наш предмет:", json["goods"][product]["name"], "ID:", product);
    let product_widg = gen_productwidg(product);
    cart_widg.appendChild(product_widg);

    total_price = total_price + json["goods"][product]["price"] * cart[product];

    console.log("Кончил с ID:", product);
  }

  let price = document.getElementById("price");
  price.textContent = niceprice(total_price) + " ₽";
}

function gen_productwidg(product) {
  console.log("Виджет товара в процессе генерации ID:", product);
  let product_widg = document.createElement("div");
  product_widg.setAttribute("class", "cool_block shopitem");

  let name = document.createElement("a");
  name.setAttribute("class", "cool_block");
  name.textContent = json["goods"][product]["name"];

  let price = document.createElement("div");
  price.setAttribute("class", "shopitem cool_block");

  price.textContent = "Кол-во: " +
    niceprice(json["goods"][product]["price"] * cart[product]) + "₽";

  let count = document.createElement("div");
  count.setAttribute("class", "shopitem cool_block");
  count.textContent = "Количество: "+ cart[product];

  let plusbutt = document.createElement("div");
  plusbutt.setAttribute("class", "shopitem cool_block shopbutt");
  plusbutt.setAttribute("onclick", "add_to_cart(" + product + ", +1);");
  plusbutt.textContent = "Добавить ещё";

  let minusbutt = document.createElement("div");
  minusbutt.setAttribute("class", "shopitem cool_block shopbutt minus");
  minusbutt.setAttribute("onclick", "add_to_cart(" + product + ", -1);");
  minusbutt.textContent = "Уменьшить";


  product_widg.appendChild(name);
  product_widg.appendChild(price);
  product_widg.appendChild(count);
  product_widg.appendChild(plusbutt);
  product_widg.appendChild(minusbutt);
  console.log("Виджет товара сгенерирован");

  return product_widg;
}

document.addEventListener("DOMContentLoaded", makeProducts);

