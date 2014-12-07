/**
 * Created by xinquanzhou on 11/21/14.
 */
var subnet;
var layout;

var shareData = {
    Network : null,
    Layout : null
};

$(document).ready(function(){
    $.ajax({
        type:"GET",
        url:"test.csv",
        dataType:"text",
        success: function(data){
            processData(data);
            var options = [];
            for (var i = 1 ; i < shareData.stepNum; i++){
                options.push("<option value='" + i + "'> step" + i + "</option>" );
            }
            $('#mutable').append(options.join("")).selectmenu();
            $("#mutable").selectmenu({
                    select: function(event, data){
                        shareData.mutable = data.item.value;
                    },
                    width: "150px",
                    position: {my: "left+10 center", at: "right center", collision: "fit "}
                }
            );
        }
    })
})

function processData(allText){
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
    lines = lines[0][1].split(":")[1]
    shareData.stepNum = parseInt(lines);
}


$('#searchArea label p').css('text-align','center');

$("#subnet").selectmenu({
    select : function(event,data){
//        console.log(data.item.value);
        subnet = data.item.value;
        shareData.Network = subnet;
    },
    width : "150px",
    position:{my : "left+10 center", at: "right center", collision: "fit "}

//            font-size:"10px"
})
    .css('attr','margin-top, 10px');

$("#layout").selectmenu({
select : function(event,data){
    console.log(data.item.value);
    layout = data.item.value;
    shareData.Layout = layout;
},
width: "150px",
    position:{my : "left+10 center ", at: "right center", collision: "fit "}

});
//
//$("#steps").selectmenu({
//    select: function(event,data){
//        shareData.steps = data.item.value;
//    },
//    width : "150px",
//    position:{my : "left+10 center", at: "right center", collision: "fit "}
//
//});

$("input[type=submit]").button({
    position:{my : "left center", at: "right center" }
})
.click(function(event){
    event.preventDefault;
    if(shareData.Layout == 'Force'){
        $("form").attr("action","graph.html");
    }
        else{
        $("form").attr("action","Chord.html");
    }

});

$("#legend").draggable().resizable();
$("#sidebar").resizable();

//$("#search").css("align","center");

var QueryString = function() {
    var v = window.location.search;
//console.log(v);
    var query_string = {};
    v = v.substring(1);
    var vars = v.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]], pair[1] ];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }
    return query_string;
};