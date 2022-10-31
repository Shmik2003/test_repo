function build_divtree(entry, n) {
  if (entry.length == 0) {
    return;
  }

  var result = document.createElement('div');
  result.setAttribute("class", "treeElement");

  result.append('\xa0'.repeat(n))
  result.append(document.createElement('a'));
  result.lastChild.append(entry[0]);

  for (let i = 0, len = entry[1].length; i < len; i++) {
    result.append(build_divtree(entry[1][i], n + 1));
  }

  return result;
}

function analyze_element(element) {
  console.log('Вошли в элемент ' + element.tagName + ' дочерних элементов '
    + element.childElementCount);

  let result = [];

  for (let x = 0; x < element.childElementCount; x++) {
    let xel = element.children[x];

    if (xel.nodeType == 1 && xel.className != "treeElement") {
      let name = xel.tagName;
      result.push([name, analyze_element(xel)]);
    }
  }
  console.log('Вышли из элемента ' + element.tagName);

  return result;
}

function start_analyze() {
  console.log("Анализ запущен!");
  var html_el = document.getElementsByTagName('HTML')[0];
  let mapa = ['HTML', analyze_element(html_el)];

  document.getElementById("tree").replaceChildren();
  document.getElementById('tree').append(
    build_divtree(mapa, 0)
  );

  console.log('Вывод древа элементов завершён успешно!');
}

document.addEventListener("DOMContentLoaded", start_analyze);

