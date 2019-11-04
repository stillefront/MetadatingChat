// create menu for voice selection
$(document).ready(function(){
    $("a.menu").click(function(){
        $("#voice_selector").toggle("slide");
        return false;
    });

    $("a.close").click(function(){
        $("#voice_selector").toggle("slide");
        return false;
    });

});