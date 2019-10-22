
$( document ).ready(function() {
    console.log( "ready!" );
  
  let counter = 0;
  let bot_array =[];
  
  
  // if you click on bots
    $( ".klick" ).on("click", function() {
  
      //count clicks
      counter += 1;
      
      if (counter == 1) {   
        //change color on clicked bot
        $(this).toggleClass('clicked');
        //$(this).css('background', '#ffff00');
        //save bot name to the array
        bot_array[0] = $(this).children('#bot-hidden-text').text();
        //bot_array[0]= $(this).find('.bot-name').text();
        //$( ".welcome-button-text p" ).replaceWith( "<p>Chatte selbst mit dem Bot!</p>" );
        console.log(bot_array[0]);
        console.log(bot_array[0].length);
      }
  
      //counter 
      if (counter == 2) {      
        //change color on clicked bot
        $(this).toggleClass('clicked');
        $('.welcome-button').addClass('button-counter');
        //$(this).css('background', '#ffff00');
        //save bot name to the bot_array  
        //bot_array[1] = $(this).children('.bot-name-description').text();
        //bot_array[1]= $(this).find('.bot-name').text();
        bot_array[1] = $(this).children('#bot-hidden-text').text();
        console.log(bot_array[1]);
        console.log(bot_array[1].length);
        ////change "suche bots to chat now"
        $( ".welcome-button-text p" ).replaceWith( "<p>Starte Chat</p>" );
        $( ".welcome-button-text p" ).css("color", "white");
  
      }
      //if more than two clicks happen
      if (counter > 2 ) {
        //change color on selected bots back to start color
        $('.klick').removeClass('clicked');
        $('.welcome-button').removeClass('button-counter');
        //$('welcome-bot-box').css('background', '#eeebf4');
        //change "chat now" back to >Bitte Wähle zwei Bots aus:
        $( ".welcome-button-text p" ).replaceWith( "<p>Bitte wähle zwei Bots aus:</p>" );
        //reset bot_array & counter
        bot_array = [0,0];
        counter = 0;
        console.log(bot_array);
      }
    }); 
    //if two clicks happpen, than you can click on the Chat button
    $(".welcome-button" ).on("click", function() {
      if (counter == 1) {
        //Cookies.set('userId', userId);
        //console.log("do you have a cookie?" + Cookies.get('userId'));
        //console.log("bot_array");  
        //$.post( "/bot/chat_onebot", { bot1: bot_array[0]});
        //window.location.href = "/bot/chat_onebot";
      }
  
      if (counter == 2) {
        var userId = Math.floor(Math.random() * 1000000000000000)
        Cookies.set('userId', userId); // should I use express sessions instead of cookies?
        console.log("do you have a cookie?" + Cookies.get('userId'));
        console.log("Send Bot information to the server and start chat between two Bots!");
        //new solution with hidden form object:
        /*
        let form = $('<form action="' + '/chat' + '" method="post">' +
        '<input type="text" name="bot1" value="' + bot_array[0] + '" />' +
        '<input type="text" name="bot2" value="' + bot_array[1] + '" />' +
        '<input type="text" name="userId" value="' + userId + '" />' +
        '</form>');
        $('body').append(form);
        form.submit();
        */

        $.redirect('/chat', {'bot1': bot_array[0], 'bot2': bot_array[1], 'userId': userId});



        //$.post( '/chat', { bot1: bot_array[0], bot2: bot_array[1], userId: userId});
        //window.location.href = '/chat';
      }
      else {
        console.log("not working!");
      }
    });
  /*
    $(".welcome-bot-box").hover(function(){
        $(this).children('.bot-box-mouse-hover').css("background-color", "#ffff00");
      }, function(){$(this).children('.bot-box-mouse-hover').css("background-color", "#eeebf4");
  
  });
  */
    console.log("lala" + bot_array);
  
  });