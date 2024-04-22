var ampladaCarta, alcadaCarta;
var separacioH = 20,
    separacioV = 20;
var nFiles = 3,
    nColumnes = 6;
var cartesSeleccionades = null;
var cartaAnterior = null;
var cartesGirades = 0;
var clicks = 0
var maxclicks = 54;
var mediumButtonClicked = false;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('low').addEventListener('click', function() {
        mostrarTaulell();
    });

    document.getElementById('medium').addEventListener('click', function() {
        mostrarTaulell();
        mediumButtonClicked = true;
    });

    document.getElementById('high').addEventListener('click', function() {
        mostrarTaulell();
    });

    function mostrarTaulell() {
        console.log("Mostrando el tablero...");
        document.getElementById("nivells").style.display = 'none';
        document.getElementById("Memory").style.display = 'flex';
        document.getElementById("tauler").style.display = 'block';
    }

    // Funci� per guardar totes les cartes en un array
    function cartes() {
        var cartes = [];
        for (var i = 1; i <= 52; i++) {
            cartes.push('carta' + i);
        }
        return cartes;
    }

    // Funci� per generar les parelles de cartes del joc
    function jocCartes() {
        var cartesJoc = cartes();
        var cartesEscollides = [];

        // Escollir aleat�riament la meitat de les cartes de les quals disposa el taulell
        for (var i = 0; i < (nFiles * nColumnes / 2); i++) {
            var randomIndex = Math.floor(Math.random() * cartesJoc.length);
            // Seleccionar la carta seleccionada de l'array de cartes
            cartesEscollides.push(cartesJoc.splice(randomIndex, 1)[0]);
        }
        // Dupliquem les cartes seleccionades per formar les parelles
        return cartesEscollides.concat(cartesEscollides);
    }

    // Funci� per barrejar l'array de cartes
    function barrejar(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    $(function() {
        ampladaCarta = $(".carta").width();
        alcadaCarta = $(".carta").height();
        // Mida del tauler
        $("#tauler").css({
            "width": (nColumnes * (ampladaCarta + separacioH) + separacioH) + "px",
            "height": (nFiles * (alcadaCarta + separacioV) + separacioV) + "px"
        });
        $("#contenidor").css({
            "width": (nColumnes * (ampladaCarta + separacioH) + separacioH) + "px",
        });

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


        var parelles = (nFiles * nColumnes) / 2;
        document.getElementById("parelles").textContent = parelles;



        $('.carta').on('click', function() {
            click();

            // Comprovem si ja s'ha trobat parella per aquesta carta
            if ($(this).hasClass('parella-trobada') || $(this).hasClass('carta-girada') || cartesGirades >= 2) return;

            $(this).toggleClass('carta-girada');
            cartesGirades++;

            // Controlem els clicks de l'usuari
            if (clicks === (3 * (nFiles * nColumnes))) {
                fiJoc();
            }

            if (cartaAnterior === null) {
                // Si no tenim cap carta seleccionada, hi guardem l'actual
                cartaAnterior = $(this);
            } else {
                // Comprovem si l'usuari ha clicat a la mateixa carta
                if (cartaAnterior.is($(this))) {
                    // Si l'usuari ha clicat a la mateixa carta, no fem res
                    return;
                }

                // Comprovem si fan parella
                if ($(this).find('.davant').attr('class') === cartaAnterior.find('.davant').attr('class')) {
                    // Si son parella, marquem les cartes com a parella trobada
                    $(this).addClass('parella-trobada');
                    cartaAnterior.addClass('parella-trobada');
                    parella();
                    cartaAnterior = null;
                    cartesGirades = 0; // Reiniciem el comptador de cartes girades en aquest torn
                    if (parelles === 0) {
                        var modal = document.getElementById("modal");
                        modal.style.display = "block";
                    }
                } else {
                    // Si no son parella, tornem a girar les cartes de nou
                    setTimeout(() => {
                        $(this).toggleClass('carta-girada');
                        cartaAnterior.toggleClass('carta-girada');
                        cartaAnterior = null;
                        cartesGirades = 0; // Reiniciem el comptador de cartes girades en aquest torn
                    }, 800);
                }
            }
        });

        function parella() {
            parelles--;
            document.getElementById("parelles").textContent = parelles;
        }

        function click() {
            clicks++;
            document.getElementById("clicks").textContent = clicks;
            console.log("Se ha hecho clic. Número de clics:", clicks);

            if (clicks > maxclicks) {
                // Show the Buttonmodal
                var modal = document.getElementById("modal");
                modal.style.display = "block";
            }
        }
        document.getElementById('exitButton').addEventListener('click', exit);

        //Function to exit
        function exit() {
            clicks = 0;
            document.getElementById("clicks").textContent = clicks;
            document.location.reload();
        }

        document.getElementById('restartButton').addEventListener('click', restartGame);

        // Function to restart the game
        function restartGame() {
            // Reset all game variables and elements to their initial state

            // Reset game variables
            clicks = 0;
            document.getElementById("clicks").textContent = clicks;

            // Reset cards' state
            $('.carta').removeClass('carta-girada');
            $('.carta').removeClass('parella-trobada');

            // Reset remaining pairs count
            parelles = (nFiles * nColumnes) / 2;
            document.getElementById("parelles").textContent = parelles;

            // Hide the modal if it's open
            var modal = document.getElementById("modal");
            modal.style.display = "none";

            // Reset time counter
            segons = -1;
            minuts = 0;
            setCounter();
        }

        var segons = -1;
        var minuts = 0;

        function setCounter() {
            segons++;
            if (segons === 60) {
                segons = 0;
                minuts++;
            }
            // Formatejem els minuts i els segons amb dos d�gits
            var minutosStr = minuts < 10 ? "0" + minuts : minuts;
            var segundosStr = segons < 10 ? "0" + segons : segons;
            var l = document.getElementById("contador");
            l.innerHTML = minutosStr + ":" + segundosStr;
        }

        function startCounter() {
            setCounter();
            setInterval(setCounter, 1000);
        }
        document.getElementById('low').addEventListener('click', startCounter);
        document.getElementById('medium').addEventListener('click', startCounter);
        document.getElementById('high').addEventListener('click', startCounter);
    });

    // Function to switch the positions of two random cards within one space (up, down, left, or right)
    function switchCards() {
        // Get all cards on the board
        const cards = document.querySelectorAll('.carta');

        // Select a random card that is not already matched
        let index;
        do {
            index = Math.floor(Math.random() * cards.length);
        } while (cards[index].classList.contains('parella-trobada'));

        // Get the row and column of the selected card
        const row = Math.floor(index / nColumnes);
        const col = index % nColumnes;

        // Select a random direction: 0 for up, 1 for down, 2 for left, 3 for right
        const direction = Math.floor(Math.random() * 4);

        // Calculate the new index based on the selected direction
        let newIndex;
        switch (direction) {
            case 0: // Up
                newIndex = row > 0 ? index - nColumnes : index;
                break;
            case 1: // Down
                newIndex = row < nFiles - 1 ? index + nColumnes : index;
                break;
            case 2: // Left
                newIndex = col > 0 ? index - 1 : index;
                break;
            case 3: // Right
                newIndex = col < nColumnes - 1 ? index + 1 : index;
                break;
        }

        // Switch the positions of the selected card and the card in the chosen direction
        const card1 = cards[index];
        const card2 = cards[newIndex];
        const tempLeft = card1.style.left;
        const tempTop = card1.style.top;
        card1.style.left = card2.style.left;
        card1.style.top = card2.style.top;
        card2.style.left = tempLeft;
        card2.style.top = tempTop;
    }

});