/**
 * Created by xinquanzhou on 11/21/14.
 */


var width = window.innerWidth,
    height = window.innerHeight;

var zoomer = d3.behavior.zoom().scaleExtent([-20, 20]).on("zoom", zoom);

//var color = ['rgb(44,162,95)','rgb(136,86,167)','rgb(67,162,202)','rgb(227,74,51)','rgb(221,28,119)','rgb(250,159,181)'];
var color = ['rgb(141,211,199)','rgb(255,255,179)','rgb(190,186,218)','rgb(251,128,114)','rgb(128,177,211)','rgb(253,180,98)'];

//var nodeColors = {
//    "Chromsome1": "rgb(44,162,95)",
//    "Chromsome2": "rgb(136,86,167)",
//    "Chromsome3": "rgb(67,162,202)",
//    "Chromsome4": "rgb(227,74,51)",
//    "Chromsome5": "rgb(221,28,119)",
//    "Chromsome6": "rgb(250,159,181)"
//};
var nodeColors = {};
for(var i = 0 ; i < 6 ; i++){
    var name = 'Chromsome' + i;
    nodeColors[name] = color[i];
}

var svg = d3
    .select("body")
    .append("svg")
    .attr("shape-rendering", "auto")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .call(zoomer)
    .append("g");

if (!location.hash) {
    zoomer.scale(0.6);
    zoomer.translate([850, 700]);
    svg.attr("transform","translate(830, 700) scale(0.7)");
}

var overlaySize = width * 20; // maxzoomlevel

var rect = svg.append("rect")
    .attr("class", "overlay")
    .attr("width", (width * 10) + overlaySize)
    .attr("height", (height * 10) + overlaySize)
    .attr("x", -overlaySize)
    .attr("y", -overlaySize);

var node, link, text, graphSource;

var nodeGroupInfo = d3.select(".nodes-info")
    .selectAll("li")
    .data(d3.keys(nodeColors))
    .enter()
    .append("li");
nodeGroupInfo.append("em").attr("style", function (d) {
    return "background: " + nodeColors[d];
});
nodeGroupInfo.append("span").text(function (d) {return d}, "span");
var initSize = [];
d3.json("out3000.json", function(error, graph) {
    graphSource = graph;
//        console.log(graph);
    loadGraph();

    $('circle').each(function(d){
//        console.log($(this).attr('r'));
        initSize.push($(this).attr('r'));
//    console.log(initSize);
    });
});


function loadGraph() {
    link = svg
        .selectAll(".link")
        .data(graphSource.links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", function(d) { return 'yellow' })
        .filter(function(d){
            return d.weight>8;
        })
        .attr("d", function(d) {
            var dx = graphSource.nodes[d.target].x - graphSource.nodes[d.source].x,
                dy = graphSource.nodes[d.target].y - graphSource.nodes[d.source].y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + graphSource.nodes[d.source].x + "," + graphSource.nodes[d.source].y + "A" + dr + "," + dr + " 0 0,1 " + graphSource.nodes[d.target].x + "," + graphSource.nodes[d.target].y;
        });

    node = svg
        .selectAll(".node")
        .data(graphSource.nodes)
        .enter().append("g")
        .attr("class", "node")
        .filter(function(d){
            return d.r > 2;
        })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .on('click', function (d) {
//            $('#description').html("<p>This Gene is on" + d.chrom + "chromosome, and " + d.descrip +  "</p>");
//            var content = document.getElementById('description');
//            content.innerHTML = d.name + ' ' + d.chrom;
            window.location = '#' + d.name;
            catchLocationHash();
        });

    node.append("circle")
        .attr("r", function(d) {
//                    console.log(d.r);
            var range = $("#slider").slider("value");
            return Math.log(d.r) * range;
        })
        .style("fill", function(d) {
//                    console.log(d.group);
            if(d.chrom == 'X' || d.chrom == 'Y'){
                console.log(d.chrom);
                return color[5];
            }
            else {
                return color[parseInt(d.chrom / 6)];
            }
        });

    node.append("text")
        .attr("class", function (d) {
            return d.r > 1 ? "huge":"small";
        })
        .attr("dy", "0.3em")
        .attr("dx", 0)
        .style("text-anchor", "middle")
        .style("font-size", function (d) {
            if (d.r > 1) {
                return 14 - d.name.length;
            } else {
                return 6;
            }
        })
        .text(function(d) {
            if(d.r > 2) {
                return d.name.substring(0, 20);
            }
            else{
                return null;
            }
        });

    catchLocationHash(true);
}


console.log(initSize);
$("#slider").slider({
    orientation: "horizantal",
    range: "min",
    max: 15,
    value: 8,
    slide: refreshSize,
    change:refreshSize
});

function refreshSize() {
    var count = 0 ;
    $('circle').each(function(){
//        var r =$(this).attr('r');
        $(this).attr('r',function(){
//            console.log(initSize[count++]);
            return initSize[count++] * $("#slider").slider("value") / 10;
        })
    })
}
function selectNode(d, focus) {
//    if(level > 1){
//        return ;
//    }
    blurNodes();
//    $('.node').css('opacity',0.2);
    node.attr("class", "node background");
    d3.select(this).attr("class", "node hover");
    $(this).css('-webkit-opacity',1);
    link.filter(function (_d) {
        return _d.source == graphSource.nodes.indexOf(d);

//        return _d.source;
    })
        .attr("class", "link hover")
        .each(function (_d) {
            node.filter(function (_n) {
                return _n.name == graphSource.nodes[_d.target].name;
            })
//                .css("opacity",1)
                .attr("class", "node hover");


        });
//    $('.node').css('opacity',1);

    if (focus) {
        var coordinates = null;
        node.each(function (_n) {
            if (_n.name == d.name) {
                coordinates = [_n.x, _n.y];
            }
        });
        if (coordinates) {

            var x = (coordinates[0] * -1) + width / 2;
            var y = (coordinates[1] * -1) + height / 2;

            zoomer.translate([x, y]);
            zoomer.scale(1);

            svg.transition()
                .attr("transform", "translate(" + x + ", " + y + ") scale(1)");

        }
    }
//    $(this).css('opacity',0.2);

}

function zoom() {
    svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
}

function blurNodes() {
    node.attr("class", "node");
    $(".node").css("-webkit-opacity",0.2);
//    $(".node").addClass("background");
    link.attr("class", "link");
}

rect.on('click', blurNodes);

$("#search").keypress(function(){
    var searchField = $("#search").val();
    window.location = '#' + searchField;
    catchLocationHash(true);
//    console.log(searchField);
});

function catchLocationHash(focus) {
    var hash = location.hash;
    if (hash) {
        var hashParts = hash.substr(1);
        d3.selectAll(".node").each(function (d) {
            if (d.name == hashParts) {
                $('#description').html(d.name+"This Gene is on the " + d.chrom + "th chromosome. \nGene Description: " + d.descrip);
                selectNode.call(this, d, focus);
            }

        })
    }
}

window.addEventListener("hashchange", catchLocationHash.bind(this, false), true);