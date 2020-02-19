// these functions are triggered when user click 'Select', 'Back' or 'Start Chat' button

var firstSelectedBot, secondSelectedBot;

function selectFirstBot() {

    // reset preview on the second list
    $('#preview_img_2').empty();
    $('#preview_name_2').empty();
    $('#preview_des_2').empty();
    $('.bot img').removeClass("selected_2");


    // save the first bot as a variable
    firstSelectedBot = firstTmpBot;

    // user must select a bot, it won't go to next slide when there is none.
    if (firstSelectedBot !== undefined) {
        console.log("firstBot selected!: " + firstSelectedBot);

        // set the html code on second list same as the first
        document.getElementById('bot_list_2').innerHTML = document.getElementById('bot_list_1').innerHTML;

        // move to next slide
        fullpage_api.moveSlideRight();

        $('.warning').css('display', 'block')
        .empty()
        .html('Please select the second bot')
    }

    else {
        console.log("Please select the first bot");
    }

}

function selectSecondBot() {

    // reset preview on the summary page
    $("#firstchosenbot").empty();
    $("#secondchosenbot").empty();

    // save the second bot as a variable
    secondSelectedBot = secondTmpBot;

    // user must select a bot, it won't go to next slide when there is none.

    if (secondSelectedBot !== undefined) {
        console.log("secondBot selected!: " + secondSelectedBot);
        console.log("--summary--firstBot: " + firstSelectedBot + " vs secondBot: " + secondSelectedBot)

        // check the botJSON array, retrieve infos, and push html code for summary page.
        for (let i = 0; i < bot_list.length; i++) {
            // push image
            if (firstSelectedBot === bot_list[i].name) {
                var img = document.createElement("IMG");
                img.setAttribute("src", bot_list[i].image_path);
                $('#firstchosenbot').append(img);

            } else if (secondSelectedBot === bot_list[i].name) {
                var img = document.createElement("IMG");
                img.setAttribute("src", bot_list[i].image_path);
                $('#secondchosenbot').append(img);
            }
            // push description
        }

        // show summary container and hide chat
        $('.summerizeBot-container').css("display", "block");
        $('.chat-container').css("display", "none");
        $('.slider-container').css("display", "none");
        $('#startChatbtn').css("display", "inline");

        // move to next slide
        fullpage_api.moveSlideRight();
    }

    else {
        $('.warning').css('display', 'block')
            .empty()
            .html('Please select the second bot')
        console.log("Please select the second bot");
    }

}


function backToSelectSemester() {
    firstTmpBot = undefined;
    fullpage_api.moveSlideLeft();
    $('.warning').css('display', 'none')
        .empty()
}

function backToFirstBot() {
    secondTmpBot = undefined;
    fullpage_api.moveSlideLeft();
    $('.warning').css('display', 'none')
        .empty()
}

function backToSecondBot() {
    fullpage_api.moveSlideLeft();
    $('.warning').css('display', 'none')
        .empty()
}

function startChat() {
    var userId = Math.floor(Math.random() * 1000000000000000)
    Cookies.set('userId', userId);
    console.log("do you have a cookie?" + Cookies.get('userId'));
    console.log("Send Bot information to the server and start chat between two Bots!");

    console.log(firstSelectedBot + " " + secondSelectedBot + " " + userId); // debug

    $.redirect('/chat', { 'bot1': firstSelectedBot, 'bot2': secondSelectedBot, 'userId': userId });


    
    //$('.chat-container').css("display", "block");
    $('.slider-container').css("display", "block");
    $('.summerizeBot-container').css("display", "none");
    //$('#startChatbtn').css("display", "none");
    
   
    //pingpong();
}