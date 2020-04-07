$(document).ready(function() {

// MY Id
// http://157.230.17.132:4033/sales






    function trovaApi() {
        $.ajax({
           url: 'http://157.230.17.132:4033/sales',
           method: 'GET',
           success: function (data) {
               // console.log(data);
           },
           error: function (err) {
               // alert('Non va');
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
