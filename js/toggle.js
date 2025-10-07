const extendLink = document.getElementById('extend');
const initSpan = document.getElementById('init');

const textoAdicional = [
  "estratégia kriativa",
  "design gráphico",
  "design de produto digital",
  "fotographia a.k.a photografia",
  "curadores de musika",
  "sinalização & wayfinding",
  "identidade visual",
  "bland branding",
  "motion design",
  "arquitetos digitæs",
  "código",
  "guidelines",
  "embalagem",
  "naming",
  "fazedor de imagem",
  "€ qualquer coisa se você for maluco o suficiente",
  "tenta a sorte."
];
const showtimesAsString = textoAdicional.join(', ');

function changeContent(e) {
  e.preventDefault();

  // evita execução múltipla
  if (initSpan.dataset.expanded === 'true') return;

  // pega o HTML atual do span
  let currentHTML = initSpan.innerHTML;

  // remove o <a ...>...</a> (o link +38)
  currentHTML = currentHTML.replace(/<a\b[^>]*>.*?<\/a>/i, '');

  // remove o " e" que ficaria antes do link (com espaços/newlines)
  currentHTML = currentHTML.replace(/\s*e\s*$/i, '').trim();

  // escolhe separador: se já termina com vírgula, só espaço; senão adiciona ", "
  const separator = currentHTML && !/,\s*$/.test(currentHTML) ? ', ' : (currentHTML ? ' ' : '');

  // concatena e marca como expandido
  initSpan.innerHTML = currentHTML + separator + showtimesAsString;
  initSpan.dataset.expanded = 'true';

  // remove o link do DOM (opcional) para limpar o HTML
  if (extendLink) extendLink.remove();
}

extendLink.addEventListener('click', changeContent);


const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

if (isTouch) {
  const menuItems = document.querySelectorAll("#menu span");
  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      menuItems.forEach(i => i.classList.remove("hover"));
      item.classList.add("hover");
    });
  });
}

document.addEventListener("click", e => {
  if (!e.target.closest("#menu")) {
    document.querySelectorAll("#menu span").forEach(i => i.classList.remove("hover"));
  }
});
