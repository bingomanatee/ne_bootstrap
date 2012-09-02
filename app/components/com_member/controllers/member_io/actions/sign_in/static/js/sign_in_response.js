$(function () {
    setTimeout(function(){
        console.log('trapping result');
        var suf = $('#sign_in_form');
        console.log('suf: ', suf);
        suf.submit(function () {
            console.log('suf trapped');
            var form_vals = _.reduce(suf.serializeArray(), function (m, f) {
                m[f.name] = f.value;
                return m
            }, {});

            console.log('form value: ', form_vals);

            $.post('/sign_in', form_vals, function(data){
                $('#modal').html(data);
            });
            return false;
        })

    }, 1000);
})