$(document).ready(function() {

    $(".clickable").on("click", function() {
        $('.clicked').removeClass('clicked'); 
        $(this).addClass('clicked');
    });

    $(".clickable").on("click", function(){
        let botID = $(this).find(".show_id").text();
        botID = botID.trim(); // getting rid of whitespaces at the end of provided _id value; fuck jQuery?
        console.log(botID);

        let postData = {'_id' : botID};

            $.ajax({
              type: 'POST',
              data: postData,
              dataType: "json",
              //success: function() { ... },
              //error: function(){ ... },
              url: '/admin/refresh',
              cache:false
            });
        
    });


});
