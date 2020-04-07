$(document).ready(function() {

// MY Id
// http://157.230.17.132:4033/sales


    function trovaApi() {
        $.ajax({
            url: 'http://157.230.17.132:4033/sale',
            method: 'GET',
            success: function (data) {
                var rispostaTrovaApi = data;
                var oggettoIntermedio = {};
                for (var i = 0; i < rispostaTrovaApi.length; i++) {
                    var rispostApi = rispostaTrovaApi[i];
                    var amount = rispostApi.amount;
                }
            },
            error: function() {
                alert('error')
        }
    });


    }


// var ctx = $('#grafico');
// var chart = new Chart(ctx, {
//
//     type: 'line',
//     data: data,
//     options: options
//
// });




});
