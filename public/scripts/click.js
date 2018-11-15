$(document).ready(function() {

    $(".clickable").on("click", function() {
        $('.clicked').removeClass('clicked'); 
        $(this).addClass('clicked');
    });

    $(".clickable").on("click", function(){
        let botName = $(this).find(".show_name").text();
        let botDescription = $(this).find(".show_description").text();
        let botID = $(this).find(".show_id").text();

        console.log(botName, botDescription, botID);

        var updateName = {};
        updateName.value = $(this).find(".show_name").text();

        var updateDescription = {};
        updateDescription.value = $(this).find(".show_description").text();

        var updateWorkspaceID = {};
        updateWorkspaceID.value = $(this).find(".show_workspace_id_url").text();

        var updateImageUrl = {};
        updateImageUrl.value = $(this).find(".show_image_path").text();

        var updateUsernameToken = {};
        updateUsernameToken.value = $(this).find(".show_username_token").text();

        var updatePasswordToken = {};
        updatePasswordToken.value = $(this).find(".show_password_token").text();
        
        $('.updateName').attr(updateName);
        $('.updateDescription').attr(updateDescription);
        $('.updateWorkspaceID').attr(updateWorkspaceID);
        $('.updateImageUrl').attr(updateImageUrl);
        $('.updateUsernameToken').attr(updateUsernameToken);
        $('.updatePasswordToken').attr(updatePasswordToken);

    });

});


    /*
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
              cache: false
            });
        
    });


});

*/

// next try: no mongodb fuckery, just transfer the values via jquery DOM manipulation and 'this' keyword
