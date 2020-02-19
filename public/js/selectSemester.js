var semester;

var list_bots;


// select semester slide: bot list is changed by user's selection
// when user select(click) the semester then, 

$(document).on("click", "#selectSemester-container>div", function () {

    //store the selected semester id
    semester = this.id;

    //empty all the stored html code for reset
    $('#bot_list_1').empty();
    $('#preview_img_1').empty();
    $('#preview_name_1').empty();
    $('#preview_des_1').empty();
    
    $('#bot_list_2').empty();
    $('#preview_img_2').empty();
    $('#preview_name_2').empty();
    $('#preview_des_2').empty();

    $('.warning').css('display', 'block')
        .empty()
        .html('Please select the first bot')
    
    
    // getting it from the database!
    console.log(bot_list);



    $.getJSON("json/botList.json", getJSONcallback);
    //$.getJSON(bot_list, getJSONcallback);
    
    // move slide right
    fullpage_api.moveSlideRight();

})

function getJSONcallback(data) {
    list_bots = data;

    let tmpBotListString = [];

    //if user selects !alles semester
    if (semester !== 'alles') {
        //load each data, check the semester and push it to tmpBotListString 
        $.each(bot_list, function (key, value) {
            if (data[key].semester === semester) {
                tmpBotListString.push("<li class='bot'> <img src=" + value.image_path + " id=" + JSON.stringify(value.name) + "><br>" + value.name + "</li>");
            }

        });
    }

    //if user selects allesemester
    else if (semester === 'alles') {
        //load each data and push all to tmpBotListString 
        $.each(bot_list, function (key, value) {
             tmpBotListString.push("<li class='bot'> <img src=" + value.image_path + " id=" + JSON.stringify(value.name) + "><br>" + value.name + "</li>");
             console.log(value.name)
        });
    }

    //create bot_list-container <ul/> and join the tmpBotListString
    $("<ul/>", {
        "class": "bot_list-container",
        html: tmpBotListString.join("")
    }).appendTo("#bot_list_1");
}
