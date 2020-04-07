$(document).ready(function () {

// MY Id
// http://157.230.17.132:4033/sales

    $.ajax({
        url: 'http://157.230.17.132:4033/sales',
        method: 'GET',
        success: function(data){
            var sumforMonth = {};
            var rispostaTrovaApi = data;
            for (var i = 0; i < rispostaTrovaApi.length; i++) {
                var dato = rispostaTrovaApi[i]
                var month = dato.date;
                var thisMonth = moment(month, 'DD/MM/YYYY').format("MMMM");
                if (sumforMonth [thisMonth] === undefined) {
                    sumforMonth [thisMonth] = 0;
                }
                sumforMonth [thisMonth] += dato.amount;

            }
                var labelsChart = [];
                var dataChart = [];

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



    // var ctx = $('#grafico');
    // var chart = new Chart(ctx, {
    //
    //     type: 'line',
    //     data: data,
    //     options: options
    //
    // });

});
