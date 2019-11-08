$(document).ready(function() {

    $(".clickable").on("click", function() {
        $('.clicked').removeClass('clicked'); 
        $(this).addClass('clicked');
    });

    $(".clickable").on("click", function(){
        //Hiden aller anderen DIVs
        $("#updateDIV").removeClass("hidden");
        $('#h1--admin-welcome').addClass('hidden');
        $('#addDIV').addClass('hidden');
        $('#deleteBotButton').removeClass('hidden');
        $("#confirmButton").addClass("hidden");
        
        var updateName = {};
        updateName.value = $(this).find(".show_name").text();
        console.log(updateName);

        var updateDescription = {};
        updateDescription.value = $(this).find(".show_description").text();

        var updateWorkspaceID = {};
        updateWorkspaceID.value = $(this).find(".show_workspace_id").text();
        console.log(updateWorkspaceID);

        var updateIamApikey = {};
        updateIamApikey.value = $(this).find(".show_iam_apikey").text();
        console.log(updateIamApikey);

        var showDocumentID = {};
        //showDocumentID.value = $(this).find(".show_document_id").text();
        showDocumentID.value = $.trim($(this).find(".show_document_id").text());
        console.log(showDocumentID);

        var updateIsPublic = {};
        updateIsPublic.value = $(this).find(".show_is_public").text();
        $("#isPublic").prop('value', updateIsPublic.value);
        console.log(updateIsPublic);

        var updateGroup = {};
        updateGroup.value = $(this).find(".show_group").text();
        console.log(updateName);



        var showPic;
        showPic = $(this).find(".show_pic").attr("src");
        console.log('showPic: ', showPic);
        
        $('.updateName').attr(updateName);
        $('.updateDescription').attr(updateDescription);
        $('.updateWorkspaceID').attr(updateWorkspaceID);
        $('.updateIamApikey').attr(updateIamApikey);
        $('.showDocumentID').attr(showDocumentID);
        $('.updateIsPublic').attr(updateIsPublic);
        $('.updateGroup').attr(updateGroup);


        $('form.imgupload').removeClass("hidden");
        $('section.imgupload').removeClass("hidden");

        $('.imgClicked').removeAttr("src");
        $('.imgClicked').attr("src", showPic);


        //$('.showDocumentID').empty();
        //$('.showDocumentID').append(showDocumentID);

    });

    $("#deleteBotButton").on("click", function(){
        $('#deleteBotButton').addClass('hidden');
        $("#confirmButton").removeClass("hidden");
        
        var showBotID = {};
        //showDocumentID.value = $(this).find(".show_document_id").text();
        showBotID.value = $('.showDocumentID').val();

        $('.updateDocumentID').attr(showBotID);
        console.log(showBotID);
      });

});
