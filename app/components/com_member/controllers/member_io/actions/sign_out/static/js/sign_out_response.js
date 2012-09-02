$(function () {
    setTimeout(function(){
        console.log('trapping result');
        var suf = $('#sign_out_form');
        console.log('suf: ', suf);
        suf.submit(function () {
            console.log('suf trapped');

            $.get('/sign_out', function(data){
                $('#modal').html(data);
            });
            return false;
        })

    }, 1000);
})