$(document).ready(function () {

// MY Id
// http://157.230.17.132:4033/sales

    $.ajax({
        url: 'http://157.230.17.132:4033/sales',
        method: 'GET',
        success: function(data){
            var sumforMonth = {
                'gennaio': 0,
                'febbraio': 0,
                'marzo': 0,
                'aprile': 0,
                'maggio': 0,
                'giugno': 0,
                'luglio': 0,
                'agosto': 0,
                'settembre': 0,
                'ottobre': 0,
                'novembre': 0,
                'dicembre': 0
            };
            console.log(sumforMonth);

            var rispostaTrovaApi = data;
            console.log(data);
            for (var i = 0; i < rispostaTrovaApi.length; i++) {
                var dato = rispostaTrovaApi[i]
                console.log(dato.salesman);
                console.log(dato.amount);
                console.log(dato.date);
                var month = dato.date;
                var thisMonth = moment(month, 'DD/MM/YYYY').format("MMMM");
                if (sumforMonth [thisMonth] === undefined) {
                    sumforMonth [thisMonth] = 0;
                }
                sumforMonth [thisMonth] += dato.amount;
            }
                var labelsChart = [];
                console.log(labelsChart);
                var dataChart = [];
                console.log(dataChart);

                for (var key in sumforMonth) {
                    labelsChart.push(key);
                    dataChart.push(sumforMonth[key])
                }
                Totale(labelsChart, dataChart)
        },
        error: function(){
            alert('error')
        }
    });


    function Totale(labels, data){
        var ctx = $('#grafico');
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Fatturato Mensile 2017',
                    backgroundColor: 'lightgrey',
                    borderColor: 'grey',
                    data: data
                }]
            },
        });
    };

});
