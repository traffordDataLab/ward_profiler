// data format: geojson with features containing properties.value(a number) and properties.area_name (a string) to produce the Choropleth

function choro(obj){

var newDate = new Date()

var data = (obj.data) ? obj.data:["",""];//data on the format described above *required
var container = (obj.container) ? obj.container:"";//selector for the existing element that will contain the svg *required
var palette = (obj.barColour) ? obj.barColour:["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"];
var strokeColour = (obj.strokeColour) ? obj.strokeColour:"#fc6721";
var title = (obj.title) ? obj.title:"";
var subtitle = (obj.subtitle) ? obj.subtitle:"";
var legendTitle = (obj.legendTitle) ? obj.legendTitle:"";
var source = (obj.source) ? "Source: " + obj.source :"";
var width = (obj.width) ? obj.width:600; //optional width and height
var height = (obj.height) ? obj.height:560;
var clickFunction = (obj.clickFunction) ? obj.clickFunction:""
var markClick  = (obj.markClick) ? obj.markClick:false
var indexToMark = (obj.indexToMark) ? obj.indexToMark:""

var char_array = data.features[1].properties.value.toString().split(""); // split every single char
var not_decimal = char_array.lastIndexOf(".");
var numDigits = (not_decimal<0)?",.0f":",." + (char_array.length - not_decimal - 1) + "f"

   var svg = d3.select(container)
       .append("svg")
       .attr("viewBox", "0 0 " + width + " " + height)
       .attr("preserveAspectRatio", "xMinYMin meet")
  var projection = d3.geoMercator()
      .center([ -2.35533605967,53.4190090526 ])
      .translate([width/2, height/2])
      .scale([width * 200]);
  var path = d3.geoPath()
      .projection(projection);
  var quantize = d3.scaleQuantize()
      .range(palette);

    quantize.domain([
      d3.min(data.features, function(d) { return d.properties.value; }),
      d3.max(data.features, function(d) { return d.properties.value; })
    ]);
  //Plot polygones
  svg.selectAll("path")
  				   .data(data.features)
  				   .enter()
  				   .append("path")
  				   .attr("d", path)
             .attr("class", function(d) {return "boundary " + d.properties.area_name} )
             .on("click", function(d) {
               d3.select(this).call(clickFunction,d.properties)
             })
             .on("mouseover", function(d) {
               d3.select(this).call(clickFunction,d.properties)
             })
  				   .style("fill", function(d) {
  				   		var value = d.properties.value;
                console.log("value")
                console.log(value)
                if (value) {
                  return quantize(value);
                } else {
                  return "#ccc";
                }
              });

              // Legend
              var g = svg.append("g")
                  .attr("class", "legend")
                  .attr("transform", "translate(480,380)");
              g.append("text")
                  .attr("class", "legendTitle")
                  .attr("x", 0)
                  .attr("y", -10)
                  .text(legendTitle);
              var legend = d3.legendColor()
                  .labelFormat(d3.format(numDigits))
                  .scale(quantize);
              svg.select(".legend")
                  .call(legend);
              // Title
              svg.append("g")
                .attr("transform", "translate(10, 20)")
                .append("text")
                .text(title)
                .style("font-family", "Roboto")
                .style("font-size", "18px")
                .style("fill", "#757575");
              // Subtitle
              svg.append("g")
                .attr("transform", "translate(10, 40)")
                .append("text")
                .text(subtitle)
                .style("font-family", "Roboto")
                .style("font-size", "14px")
                .style("fill", "#757575")
                // Source label
                svg.append("g")
                  .attr("transform", "translate(10, 540)")
                  .append("text")
                  .text(source)
                  .style("font-family", "Roboto")
                  .style("font-size", "10px")
                  .style("fill", "#757575");
                  //copyright
                svg.append("g")
                  .attr("transform", "translate(10, 555)")
                  .append("text")
                  .text("Contains National Statistics and OS data © Crown copyright and database right " + newDate.getFullYear())
                  .style("font-family", "Roboto")
                  .style("font-size", "10px")
                  .style("fill", "#757575");

}
