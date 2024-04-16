var ampladaCarta, alcadaCarta;
var separacioH = 20,
    separacioV = 20;
var nFiles = 3,
    nColumnes = 6;

// Funció per guardar totes les cartes en un array
function cartes() {
    var cartes = [];
    for (var i = 1; i <= 52; i++) {
        cartes.push('carta' + i);
    }
    return cartes;
}

// Funció per generar les parelles de cartes del joc
function jocCartes() {
    var cartesJoc = cartes();
    var cartesEscollides = [];

    // Escollir aleatòriament la meitat de les cartes de les quals disposa el taulell
    for (var i = 0; i < (nFiles * nColumnes / 2); i++) {
        var randomIndex = Math.floor(Math.random() * cartesJoc.length);
        cartesEscollides.push(cartesJoc.splice(randomIndex, 1)[0]); // Seleccionar la carta seleccionada de l'array de cartes
    }
    // Dupliquem les cartes seleccionades per formar les parelles
    return cartesEscollides.concat(cartesEscollides);
}

$(function () {
    ampladaCarta = $(".carta").width();
    alcadaCarta = $(".carta").height();
    // Mida del tauler
    $("#tauler").css({
        "width": (nColumnes * (ampladaCarta + separacioH) + separacioH) + "px",
        "height": (nFiles * (alcadaCarta + separacioV) + separacioV) + "px"
    });

    // Funció per barrejar l'array de cartes
    function barrejar(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    var cartesJoc = jocCartes();
    cartesJoc = barrejar(cartesJoc);

    var contador = 0;
    for (var f = 1; f <= nFiles; f++) {
        for (var c = 1; c <= nColumnes; c++) {
            contador++;
            var carta = $('<div class="carta" id="f' + f + 'c' + c + '"><div class="cara darrera"></div><div class="cara davant"></div></div>');
            carta.css({
                "left": ((c - 1) * (ampladaCarta + separacioH) + separacioH) + "px",
                "top": ((f - 1) * (alcadaCarta + separacioV) + separacioV) + "px"
            });
            carta.find(".davant").addClass(cartesJoc[contador - 1]);
            $("#tauler").append(carta);
        }
    }

    $(".carta").on("click", function () {
        $(this).toggleClass("carta-girada");
    });
});

