$( document ).ready(function() {

    $(".clickable").on("click", function() {
        console.log("fuck jquery");
        $(this).css('background-color', 'lightsalmon');
    });


});