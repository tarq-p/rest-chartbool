
$(document).ready(function () {

    var baseUrl = 'http://157.230.17.132:4011/sales';
    stampaGrafici();

    $('#btn-invia').click(function () {
        var nomeVenditore = $('#sel-venditore').val();
        var dataVendita = $('#input-data').val();
        var dataVenditaFormattata = moment(dataVendita, 'YYYY-MM-DD').format('DD/MM/YYYY');
        var vendita = parseInt($('#input-vendita').val());
        $.ajax({
            url: baseUrl,
            method: 'POST',
            data: {
                salesman: nomeVenditore,
                amount: vendita,
                date: dataVenditaFormattata
            },
            success: function (data) {
                stampaGrafici();
            },
            error: function (err) {
                alert('errore');
            }
        });
    });

    function stampaGrafici() {
        $.ajax ({
            url: baseUrl,
            method: 'GET',
            success: function (data) {
                // console.log(data);
                // Elaboro i dati ricevuti dal server per farne due array
                // Dò in pasto a Chart.js i due array
                var datiMensili = costruttoreDatiMensili(data); // Elaboriamo i dati della GET per renderli digeribili da Chart.js (ritorna un oggetto)
                createLineChart(datiMensili.mesi, datiMensili.vendite); // Diamo in pasto a Chart.js le labels e data ricavati dall'oggetto datiMensili
                var fatturato = fatturatoTotale(data);
                var datiVenditori = costruttoreDatiVenditori(data, fatturato);
                createPieChart(datiVenditori.venditori, datiVenditori.vendite);

            },
            error: function (err) {
                alert('Errore API: ' + err);
            }
        });
    }

    function costruttoreDatiMensili(vendite) {
        var venditeMensili = {
            gennaio: 0,
            febbraio: 0,
            marzo: 0,
            aprile: 0,
            maggio: 0,
            giugno: 0,
            luglio: 0,
            agosto: 0,
            settembre: 0,
            ottobre: 0,
            novembre: 0,
            dicembre: 0
        };
        for (var i = 0; i < vendite.length; i++) { // Ciclo nelle vendite ricevute dal GET per aggiungere .amount all'oggetto venditeMensili
            var vendita = vendite[i]; // Valuto ogni singola vendita
            var dataVendita = vendita.date; // Estrapolo la data dall'oggetto vendita
            var meseVendita = moment(dataVendita, 'DD/MM/YYYY').format('MMMM'); // Trasformo la data nel relativo nome del mese
            venditeMensili[meseVendita] += parseInt(vendita.amount); // Uso il nome del mese appena ricavato per riconoscere la chiave nell'oggetto venditeMensili e aggiungere a questa la vendita appartenente a quel mese
        }
        var arrayMesi = []; // Inizializzo i due Array da utilizzare in Chart.js
        var arrayVendite = [];
        for (var nomeMese in venditeMensili) { // Ciclo all'interno dell'oggetto venditeMensili per trasformare la coppia chiave-valore in due array da dare a Chart.js
            arrayMesi.push(nomeMese); // Inserisco il nome del mese nell'arrayMesi
            arrayVendite.push(venditeMensili[nomeMese]); // Inserisco nell'arrayVendite la somma di tutte le vendite relative a quel mese
        }
        return {
            mesi: arrayMesi,
            vendite: arrayVendite
        };
    }

    function fatturatoTotale(vendite) {
        var fatturato = 0;
        for (var i = 0; i < vendite.length; i++) {
            var vendita = vendite[i];
            fatturato += parseInt(vendita.amount);
        }
        return fatturato;
    }

    function costruttoreDatiVenditori(vendite, fatturatoAziendale) {
        var venditeVenditori = {}; // Creazione oggetto vuoto che assumerà la somma delle vendite annuali di ogni singolo venditore
        for (var i = 0; i < vendite.length; i++) { // Ciclo for nell'array della GET
            var vendita = vendite[i]; // Considero il singolo oggetto dell'array
            var nomeVenditore = vendita.salesman; // Associo a una variabile il nome del venditore
            if (venditeVenditori[nomeVenditore] === undefined) { // Se non esiste una chiave con il nome di quel venditore la inizializzo con il valore zero
                venditeVenditori[nomeVenditore] = 0;
            }
            venditeVenditori[nomeVenditore] += parseInt(vendita.amount); // Sommo la vendita dell'oggetto attuale a quel venditore

        }
        var arrayVenditori = []; // Inizializzo i due Array da utilizzare in Chart.js
        var arrayVendite = [];
        for (var nomeVenditore in venditeVenditori) { // Ciclo all'interno dell'oggetto venditeVenditori per trasformare la coppia chiave-valore in due array da dare a Chart.js
            arrayVenditori.push(nomeVenditore); // Inserisco il nome del venditore nell'arrayVenditori
            var fatturatoPercentualeVenditore = ((venditeVenditori[nomeVenditore] / fatturatoAziendale) * 100).toFixed(2);
            arrayVendite.push(fatturatoPercentualeVenditore); // Inserisco nell'arrayVendite la somma di tutte le vendite relative a quel venditore
        }
        return {
            venditori: arrayVenditori,
            vendite: arrayVendite
        };
    }

    function createLineChart(arrayLabels, arrayData) {
        var ctx = $('#line-chart');
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: arrayLabels,
                datasets: [{
                    label: 'Vendite Mensili',
                    borderColor: 'darkblue',
                    lineTension: 0,
                    data: arrayData
                }]
            }
        });
    }

    function createPieChart(arrayLabels, arrayData) {
        var ctx = $('#pie-chart');
        var pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: [{
                    data: arrayData,
                    backgroundColor: ['Red', 'Yellow', 'Blue', 'darkorange'],
                    hoverBackgroundColor: ['lightcoral', 'khaki', 'lightblue', 'orange']
                }],
                labels: arrayLabels
            },
            options: {
                responsive: true,
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
                    }
                  }
                }
            }
        });
    }
});
