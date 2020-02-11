var firstTmpBot, secondTmpBot;

// when user chooses a bot

$(document).on("click", ".bot img", function () {
    let currentSlide = fullpage_api.getActiveSlide().item.id;

    switch (currentSlide) {
        // when user chooses a bot on first list(slide2)
        case "slide2":

            // reset preview
            $('#preview_img_1').empty();
            $('#preview_name_1').empty();
            $('#preview_des_1').empty();
            $('.bot img').removeClass("selected_1");

            $('.warning').css('display', 'none');

            // store bot id into firstTmpBot
            firstTmpBot = this.id;
            console.log("wanna choose this as the first?: " + firstTmpBot);

            // add .selected_1 for marking outline
            $(this).addClass("selected_1");

            // code for fadeIn animation
            $('#preview_img_1').removeClass("animated fadeIn").addClass("animated fadeIn");
            var el = $("#preview_img_1");
            var newone = el.clone(true);
            el.before(newone);
            $("." + el.attr("class") + ":last").remove();

            $('#preview_name_1').removeClass("animated fadeIn").addClass("animated fadeIn");
            var el = $("#preview_name_1");
            var newone = el.clone(true);
            el.before(newone);
            $("." + el.attr("class") + ":last").remove();

            $('#preview_des_1').removeClass("animated fadeIn").addClass("animated fadeIn");
            var el = $("#preview_des_1");
            var newone = el.clone(true);
            el.before(newone);
            $("." + el.attr("class") + ":last").remove();


            // display preview image and description
            for (let i = 0; i < bot_list.length; i++) {
                console.log(bot_list[i].name)
                if (firstTmpBot === bot_list[i].name) {
                    // push image
                    let img = document.createElement("IMG");
                    img.setAttribute("src", bot_list[i].image_path);
                    $('#preview_img_1').append(img);
                    // push name
                    $('#preview_name_1').html(bot_list[i].name);
                    // push description                            
                    $('#preview_des_1').html(bot_list[i].description);
                    console.log("aa")
                }
            }
            break;

        // when user chooses a bot on second list(slide3)
        case "slide3":

            // reset preview
            $('#preview_img_2').empty();
            $('#preview_name_2').empty();
            $('#preview_des_2').empty();
            $('.bot img').removeClass("selected_2");

            $('.warning').css('display', 'none');

            // store bot id into secondTmpBot
            secondTmpBot = this.id;

            // user must choose a different bot from the first
            if (secondTmpBot !== firstSelectedBot) {
                console.log("wanna choose this as the second?: " + secondTmpBot);
                // add .selected_1 for marking outline
                $(this).addClass("selected_2");

                // code for fadeIn animation 
                $('#preview_img_2').removeClass("animated fadeIn").addClass("animated fadeIn");
                var el = $("#preview_img_2");
                var newone = el.clone(true);
                el.before(newone);
                $("." + el.attr("class") + ":last").remove();

                $('#preview_name_2').removeClass("animated fadeIn").addClass("animated fadeIn");
                var el = $("#preview_name_2");
                var newone = el.clone(true);
                el.before(newone);
                $("." + el.attr("class") + ":last").remove();

                $('#preview_des_2').removeClass("animated fadeIn").addClass("animated fadeIn");
                var el = $("#preview_des_2");
                var newone = el.clone(true);
                el.before(newone);
                $("." + el.attr("class") + ":last").remove();
            } else {
                secondTmpBot = undefined;
                $('.warning').css('display', 'block')
                    .empty()
                    .html('Please choose a different bot from the first')
                console.log("You must choose a different bot from the first, otherwise it won't proceed.")
            }


            // display preview image and description
            for (let i = 0; i < bot_list.length; i++) {
                if (secondTmpBot === bot_list[i].name) {
                    // push image
                    let img = document.createElement("IMG");
                    img.setAttribute("src", bot_list[i].image_path);
                    $('#preview_img_2').append(img);
                    // push name
                    $('#preview_name_2').html(bot_list[i].name);
                    // push description                            
                    $('#preview_des_2').html(bot_list[i].description);
                }
            }
            break;
    }
});
