(function() {
  const scrollContainer = document.documentElement; // ou document.body
  let current = 0;   // posição atual
  let target = 0;    // posição desejada
  let ease = 0.07;   // suavidade (0.05–0.1 = macio, maior = mais duro)
  let isScrolling = false;

  function update() {
    // aplica easing
    current += (target - current) * ease;

    // arredonda para evitar "tremidinha"
    if (Math.abs(target - current) < 0.5) current = target;

    // aplica scroll
    scrollContainer.scrollTop = current;

    // mantém animação enquanto houver diferença
    if (Math.round(current) !== Math.round(target)) {
      requestAnimationFrame(update);
    } else {
      isScrolling = false;
    }
  }

  window.addEventListener("wheel", (e) => {
    // só aplica em desktop (mantém mobile intacto)
    if (/Mobi|Android/i.test(navigator.userAgent)) return;

    e.preventDefault(); // cancela scroll nativo

    // ajusta a posição alvo
    target += e.deltaY;

    // limites
    const maxScroll = scrollContainer.scrollHeight - window.innerHeight;
    target = Math.max(0, Math.min(target, maxScroll));

    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(update);
    }
  }, { passive: false });
})();
