document.addEventListener("DOMContentLoaded", function () {
    var cursor = document.querySelector(".custom-cursor");
    var timeoutId;
    var escala = 1;

    function escalarCursor() {
        escala += 60;
        cursor.style.transform = "scale(" + escala + ")";
    }

    function resetarCursor() {
        clearTimeout(timeoutId);
        cursor.style.transform = "scale(1)";
        escala = 1;
    }

    document.addEventListener("mousemove", function (e) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
        resetarCursor();
        clearTimeout(timeoutId); // Limpa o temporizador a cada movimento do mouse
        timeoutId = setTimeout(escalarCursor, 3000); // Configura um novo temporizador para escalar o cursor após 3 segundos
    });

    var timeoutInicial = setTimeout(escalarCursor, 3000); // Começa a escalar o cursor após 3 segundos

    document.addEventListener("mouseout", function () {
        resetarCursor();
    });
});

//<div class="custom-cursor">
//        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
//            x="0px" y="0px" viewBox="0 0 28 28" enable-background="new 0 0 28 28" xml:space="preserve">
//            <polygon fill="#FFFFFF" points="8.2,20.9 8.2,4.9 19.8,16.5 13,16.5 12.6,16.6 " />
//            <polygon fill="#FFFFFF" points="17.3,21.6 13.7,23.1 9,12 12.7,10.5 " />
//            <rect x="12.5" y="13.6" transform="matrix(0.9221 -0.3871 0.3871 0.9221 -5.7605 6.5909)" width="2"
//                height="8" />
//            <polygon points="9.2,7.3 9.2,18.5 12.2,15.6 12.6,15.5 17.4,15.5 " />
//        </svg>
//</div>