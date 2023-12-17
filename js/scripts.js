$(document).ready(function(){
    $('.button-burger-content').click(function(event){
        $('.button-burger-content, .burger-menu-menu' ).toggleClass('active');
        $('body').toggleClass('lock');
    })
})