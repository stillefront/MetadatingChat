$(document).ready(function(){

    //This are the functions that the chat uses
    
    //this is the structure for every msg from the bot
    function msgStructure(botClass, botName, botMsgContent, botPicturePath) {
        let msgStructure =  
            '<div class="' + botClass + '-msg">' + 
                '<p class="' + botClass + '-msg-name">' + botName + '</p>' +
                '<div class="' + botClass + '-msg-chat-box">' + 
                    '<p class="' + botClass + '-msg-text">' + botMsgContent + '</p>' +
                '</div>' +
                '<img class="' + botClass + '-msg-profilepicture" src="/images/bot_profile_picture/optimized_bot_images/' + botPicturePath + '.png">' + 
            '</div>';
        return msgStructure   
    };
    
    // This is a fake msg that shows the "is typing" chat box. id lottie is the ball animation
    function msgStructureIsTyping(botClass, botName, botPicturePath ) {
        let msgStructureIsTyping =  
            '<div class="' + botClass + '-is-typing-msg">' + 
                '<p class="' + botClass + '-msg-name">' + botName + '</p>' +
                '<div class="' + botClass + '-msg-chat-box">' + 
                    '<div id="lottie"></div>' +
                '</div>' +
                '<img class="' + botClass + '-msg-profilepicture" src="/images/bot_profile_picture/optimized_bot_images/' + botPicturePath + '.png">' + 
            '</div>';
        return msgStructureIsTyping   
    };
    
    // this calculates the time that the Bot needs to write a msg 
    function msgSizeTimer(msgContent) {
        let awrageCharactersPerMinute = 1150; // http://typefastnow.com/average-typing-speed
        let typingTime = Math.floor((JSON.stringify(msgContent).length * 1000) / (awrageCharactersPerMinute/60)); 
        return typingTime
    };
    
    // just a simple animation for the Is typing chat box. You can set the speed here
    function lottieAnimation() {
        var lottieElement = document.getElementById("lottie");
        lottie.loadAnimation({
            container: lottieElement, // the dom element that will contain the animation
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/lottie-animation/data.json' // the path to the animation json
          });
    
        lottie.setSpeed(3); 
    }
    //scrolling function
    var smoothscroll = function(){

       // var scrollHeight = $('#messages')[0].scrollHeight;
        //var scrollTop = $('#messages')[0].scrollTop;
       // var clientElement = scrollHeight - scrollTop;

        $('#messages').stop().animate({
            scrollTop: $('#messages')[0].scrollHeight
          } , 800);

        //console.log("scrollHeight: " + scrollHeight )
        //console.log("scrollTop: " + scrollTop )
       // console.log("clientElement: " + clientElement)
        //console.log("ClientElement" $('#messages')[0].scrollHeight) - $('#messages')[0].scrollTop))
    };

    /*
    var smoothscroll = function(){ $(window).on("scroll", function() {
        var scrollHeight = $('#messages').height();
        var clientHeight = $('#messages').height() - $('#messages').scrollTop();
	    var scrollPosition = $('#messages').height() + $('#messages').scrollTop();
	    if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
            $('#messages').stop().animate({
                scrollTop: $('#messages')[0].scrollHeight
          }, 800);
	    }
        });
    }
  */  
    //this is the function that fakes the whole "is typing" thing happen.
    function fakeItTillYouMakeIt (botClass, botName, botMsgContent, botPicturePath, SocketEmitPath, data) {
        setTimeout(function() { 
            $('#messages').append(msgStructureIsTyping(botClass, botName, botPicturePath));
            lottieAnimation();
            smoothscroll();
            
            if ( Math.floor((Math.random() * 100) + 1) > 80) {
                setTimeout(function(){
                    $("." + botClass + "-is-typing-msg").remove();	
                    smoothscroll();
    
                    setTimeout(function(){
                        $('#messages').append(msgStructureIsTyping(botClass, botName, botPicturePath));
                        lottieAnimation();
                        smoothscroll();
    
                        setTimeout(function(){
                            $("." + botClass + "-is-typing-msg").remove();
                            $('#messages').append(msgStructure(botClass, botName, botMsgContent, botPicturePath));
                            socket.emit(SocketEmitPath, JSON.stringify(data));
                            smoothscroll();	
    
                        }, msgSizeTimer(botMsgContent));
                    }, Math.floor((Math.random() * 3000)));
                }, msgSizeTimer(botMsgContent) * Math.random());
    
            } else {
                setTimeout(function(){
                    $("." + botClass + "-is-typing-msg").remove();
                    $('#messages').append(msgStructure(botClass, botName, botMsgContent, botPicturePath));
                    socket.emit(SocketEmitPath, JSON.stringify(data));
                    smoothscroll();	
                }, msgSizeTimer(botMsgContent));
            };
        }, Math.floor((Math.random() * 2000)));	
    }
    // Functions end here
    
    // Party starts here
    var socket = io();
    var funnyButton = ".chat-button"

    //automatic start. You can manipulate the static msg in data.content
    console.log("SocketClient is working. Sending first static 'hallo' msg to the first bot");
    var data = {
        "id": socket.id,
        "content": "hallo",
        "type": 'userMessage',
        "userId": Cookies.get('userId'),
    };
    socket.send(JSON.stringify(data))
    console.log("static msg was sent")
    
    //msg ping pong after automatic start
    socket.on('message', function(who, data){
        data = JSON.parse(data);
        console.log("Communication betwen msg sockets works")

        if (data.type == 'botAnswer') {
    
            fakeItTillYouMakeIt("bot1", who, data.content, data.botPhoto, "callSecondBot", data)
            console.log(who + "send a msg")
    
        } else if (data.type == 'botAnswer2') {
    
            fakeItTillYouMakeIt("bot2", who, data.content, data.botPhoto, "callFirstBot", data)
            console.log(who + "send a msg")

        } else {
            console.log("Static msg says " + data.content)
        };
    });

    $('.go-back-button').click(function(){
        socket.disconnect(); // disconnect and stop chat!
        window.location.href = "/bot";
    });

    $('.stop').click(function(){
        socket.disconnect(); // disconnect and stop chat!
    });
    
    $('.chat-button').click(function(){
        socket.disconnect(); // disconnect and stop chat!
        //$( ".chat-button p" ).replaceWith( "<p>Zurück!<p>" );
        $( this ).removeClass( "chat-button" );
        $( this ).addClass( "chat-button-back" );
        window.location.href = "/bot";
        //$( "div.chat-button" ).toggleClass( "chat-button-back" )
    });



}); 





