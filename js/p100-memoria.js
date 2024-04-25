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
var nivelHigh = false;
var nivelLow = false;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('low').addEventListener('click', function() {
        mostrarTaulell();
        mediumButtonClicked = false;
        nivelHigh = false;
        var nivelLow = true;
    });

    document.getElementById('medium').addEventListener('click', function() {
        mostrarTaulell();
        mediumButtonClicked = true;
        nivelHigh = false;
        var nivelLow = false;
    });



    document.getElementById('high').addEventListener('click', function() {
        mostrarTaulell();
        mediumButtonClicked = false;
        var nivelLow = false;
        nivelHigh = true; // Set the value to true if the "high" level is selected
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
                    if ($(this).find('.davant').attr('class') === cartaAnterior.find('.davant').attr('class')) {
                        // If they are a pair, mark the cards as found
                        $(this).addClass('parella-trobada');
                        cartaAnterior.addClass('parella-trobada');
                        parella();
                        cartaAnterior = null;
                        cartesGirades = 0; // Reset the count of flipped cards in this turn
                        if (parelles === 0) {
                            var modal = document.getElementById("modal");
                            modal.style.display = "block";
                        }
                    } else {
                        // If they don't make a pair, and we're on the "medium" level, call the function to switch the positions of two random cards
                        switch (true) {
                            case mediumButtonClicked:
                                setTimeout(() => {
                                    $(this).toggleClass('carta-girada');
                                    cartaAnterior.toggleClass('carta-girada');
                                    cartaAnterior = null;
                                    cartesGirades = 0; // Reset the count of flipped cards in this turn
                                    switchCards(); // Call the function to switch the positions of two random cards
                                }, 800);
                                break;
                            case nivelHigh:
                                setTimeout(() => {
                                    $(this).toggleClass('carta-girada');
                                    cartaAnterior.toggleClass('carta-girada');
                                    cartaAnterior = null;
                                    cartesGirades = 0; // Reset the count of flipped cards in this turn
                                    shuffleUnselectedCards(); // Call the function to shuffle unselected cards' positions
                                }, 800);
                                break;
                            default:
                                setTimeout(() => {
                                    $(this).toggleClass('carta-girada');
                                    cartaAnterior.toggleClass('carta-girada');
                                    cartaAnterior = null;
                                    cartesGirades = 0; // Reset the count of flipped cards in this turn
                                }, 800);
                        }
                    }
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
    // Función para intercambiar las posiciones de dos cartas
    function switchCards() {
        // Guardar las posiciones originales de las cartas
        const tempLeft1 = cartaAnterior.style.left;
        const tempTop1 = cartaAnterior.style.top;
        const tempLeft2 = this.style.left;
        const tempTop2 = this.style.top;

        // Intercambiar las posiciones de las cartas
        cartaAnterior.style.left = tempLeft2;
        cartaAnterior.style.top = tempTop2;
        this.style.left = tempLeft1;
        this.style.top = tempTop1;
    }


    function shuffleUnselectedCards() {
        // Get all cards on the board
        const cards = document.querySelectorAll('.carta');

        // Create an array to store unpaired cards
        const unpairedCards = [];

        // Store the initial order of the cards
        const initialOrder = [];

        // Iterate through all cards to find unpaired cards and store their initial order
        cards.forEach((card, index) => {
            if (!card.classList.contains('parella-trobada')) {
                unpairedCards.push(card);
                initialOrder.push({ card: card, index: index });
            }
        });

        // Shuffle the unpaired cards
        for (let i = unpairedCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [unpairedCards[i], unpairedCards[j]] = [unpairedCards[j], unpairedCards[i]];
        }

        // Apply transitions to make the movement smoother
        unpairedCards.forEach((card) => {
            card.style.transition = 'left 0.5s, top 0.5s';
        });

        // Calculate the number of rows and columns on the board
        const numRows = Math.ceil(unpairedCards.length / nColumnes);

        // Calculate the horizontal and vertical spacing between cards
        const horizontalSpacing = ampladaCarta + separacioH;
        const verticalSpacing = alcadaCarta + separacioV;

        // Calculate the initial margin for left and top
        const initialLeftMargin = separacioH;
        const initialTopMargin = separacioV;

        // Iterate through all cells on the board and assign cards based on the shuffled order
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < nColumnes; col++) {
                const index = row * nColumnes + col;
                if (index < unpairedCards.length) {
                    const card = unpairedCards[index];
                    const newLeft = col * horizontalSpacing + initialLeftMargin;
                    const newTop = row * verticalSpacing + initialTopMargin;
                    card.style.left = newLeft + 'px';
                    card.style.top = newTop + 'px';
                }
            }
        }
    }

    //JBS: So cartes (afegint mp3 a carpeta sounds Visual Studio)
    const so1 = new Audio('../sounds/gircarta.mp3');
    const so2 = new Audio('../sounds/parella.mp3');
    so1.volume = 1.0;
    so2.volume = 1.0;

    function reproduirSo_gircarta() {
        so1.currentTime = 0; // Reinicia el so al principi
        so1.play(); // Reprodueix el so
    }

    function reproduirSo_parella() {
        so2.currentTime = 0; // Reinicia el so al principi
        so2.play(); // Reprodueix el so
    }


    // Event listener para el botón "Back"
    document.getElementById('backButton').addEventListener('click', exit);


});