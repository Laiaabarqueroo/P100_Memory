let ampladaCarta, alcadaCarta;
const separacioH = 20,
    separacioV = 20;
const nFiles = 3,
    nColumnes = 6;
const jocCartes = [];

$(function () {
    ampladaCarta = $(".carta").width();
    alcadaCarta = $(".carta").height();
    // Mida del tauler
    $("#tauler").css({
        "width": (nColumnes * (ampladaCarta + separacioH) + separacioH) + "px",
        "height": (nFiles * (alcadaCarta + separacioV) + separacioV) + "px"
    });

    let contador = 1;
    for (let f = 1; f <= nFiles; f++) {
        for (let c = 1; c <= nColumnes; c++) {
            const carta = $('<div class="carta" id="f' + f + 'c' + c + '"><div class="cara darrera"></div><div class="cara davant"></div></div>');
            carta.css({
                "left": ((c - 1) * (ampladaCarta + separacioH) + separacioH) + "px",
                "top": ((f - 1) * (alcadaCarta + separacioV) + separacioV) + "px"
            });
            carta.find(".davant").addClass(jocCartes[contador % jocCartes.length]);
            $("#tauler").append(carta);
            contador++;
        }
    }

    $(".carta").on("click", function () {
        $(this).toggleClass("carta-girada");
    });
});
