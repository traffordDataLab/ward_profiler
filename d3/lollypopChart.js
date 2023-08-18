//Lollypop Chart d3 v4

/*data=[{area_name : "Area 1", area_code : "Code1", value : 4},
      {area_name : "Area 2", area_code : "Code2", value : 5},
      ...
    ]
*/
/*It accepts an object with the options below*/
function lollypopChart(obj){

  var data = (obj.data) ? obj.data:["",""];//data on the format described above *required
  var container = (obj.container) ? obj.container:"";//selector for the existing element that will contain the svg *required
  var palette = (obj.palette) ? obj.palette:["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"];
  var strokeColour = (obj.strokeColour) ? obj.strokeColour:"#fc6721";
  var title = (obj.title) ? obj.title:"";
  var source = (obj.source) ? obj.source:"";
  var width = (obj.width) ? obj.width:600; //optional width and height
  var height = (obj.height) ? obj.height:500;
  var clickFunction = (obj.clickFunction) ? obj.clickFunction:""
  var markClick  = (obj.markClick) ? obj.markClick:false
  var indexToMark = (obj.indexToMark) ? obj.indexToMark:""
  
console.log(data)
  
  var numFormat = d3.format(",");
  data.sort(function(a, b){
  if(isFinite(b.value - a.value)) {
    return b.value - a.value; 
  } else {
    return isFinite(a.value) ? -1 : 1;
  }

  })

  var min = d3.min(data, function (d) {
    return +d.value;
  })

  var max = d3.max(data, function (d) {
    return +d.value;
  })

  //width height and margins

  var margin = {top: 50, right: 40, bottom: 20, left: 50};

  var widthG = width - margin.left - margin.right;
  var heightG = height - margin.top - margin.bottom;

  //setup SVG

  var svg = d3.select(container).append("svg")
  .attr("viewBox", "0 0 " + width + " " + height)
  .attr("preserveAspectRatio", "xMinYMin meet")

  var lollyPC = svg.append("g")
  .attr("width", widthG)
  .attr("height", heightG)
  .attr("transform", "translate(" + (margin.left+widthG/4) + "," + margin.top + ")");

  //create Scales
  var hx = d3.scaleLinear()
  .range([0, 3*widthG/4-25])
  .domain([ min<0 ? min:0 , max]);

  var hy = d3.scaleBand()
  .rangeRound([heightG, 0])
  .domain(data.map(function (d) {
    return d.area_name;
  }));

  var quantize = d3.scaleQuantize()
  .range(palette);
  quantize.domain([
    d3.min(data, function(d) { return parseFloat(d.value); }),
    d3.max(data, function(d) { return parseFloat(d.value); })
  ]);

  //create y axis
  var yAxis = d3.axisLeft(hy)
  .tickSize(0)

  var gy = lollyPC.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .attr("transform", "translate(" + hx(0) + ", 0)");

  //Tick labels
  gy.selectAll("text")
  .data(data)
  .attr("class", function(d) {return "tickLabel " + d.area_code})
  .style("font-family", "Roboto")
  .style("font-size", "12px")
  .style("color", "#757575")
  .attr("transform", function(d) {
    if (d.value<0) {
      return "translate(12," + 0 + ")";
    } else {
      return "translate(-6," + 0 + ")";
    }
  })
  .style("text-anchor", function(d) {
    if (d.value<0) {
      return "start";
    } else {
      return "end";
    }
  })
  .on("click", function(d) {
    d3.select(this).call(clickFunction,d)
  })
  .on("mouseover", function(d) {
    d3.select(this).call(clickFunction,d)
  })

  //lollypops
  var lollyG = lollyPC.append("g")
  .attr("class", "lollypops")

  var lollypops = lollyG.selectAll(".lollypop")
  .data(data)
  .enter()
  .append("g")
  //append lines
  lollypops.append("line")
  .attr("class", function(d) {return "stick " + d.area_code})
  .attr("x1", function(d) { return hx(d.value); })
  .attr("x2", hx(0))
  .attr("y1", function(d) { return hy(d.area_name)+hy.bandwidth()/2; })
  .attr("y2", function(d) { return hy(d.area_name)+hy.bandwidth()/2; })
  .attr("stroke", "#ccc")
  //append circles
  lollypops.append("circle")
  .attr("cx", function(d) { return hx(d.value); })
  .attr("cy", function(d) { return hy(d.area_name)+hy.bandwidth()/2; })
  .attr("r", "7")
  .attr("class", function(d) {return "circle " + d.area_code})
  .style("fill", function(d) {
    if (!isNaN(parseFloat(d.value)) && isFinite(d.value)) {
      return quantize(d.value);
    } else {
      return "#ccc";
    }
  })
  .attr("stroke", "#757575")
  .on("click", function(d) {
    d3.select(this).call(clickFunction,d)
  })
  .on("mouseover", function(d) {
    d3.select(this).call(clickFunction,d)
  })

  //add a value label to the right of each lollypop
  lollypops.append("text")
  .attr("class", "valueLabel")
  .text(function (d) {
    if (!isNaN(parseFloat(d.value)) && isFinite(d.value)) {
      return numFormat(d.value);
    } else {
      return "Not Available";
    }
  })
  .style("font-family", "Roboto")
  .style("font-size", "12px")
  .style("fill", "#757575")
  .attr("y", function (d) {
    return hy(d.area_name) + hy.bandwidth()/2+4
  })
  .attr("x", function(d) {
    if (d.value<0) {
      return hx(d.value)-this.getBBox().width-10;
    } else if (isNaN(parseFloat(d.value))){
      return 10;
    } else {
      return hx(d.value) + 10;
    }
  })

  //add title and source
  lollyPC.append("text")
  .attr("class", "plot_title")
  .attr("x", -widthG/4-margin.left)
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "start")
  .text(title)
  .style("font-family", "Roboto")
  .style("font-size", "18px")
  .style("fill", "#757575");

  lollyPC.append("text")
  .attr("class", "source")
  .attr("x", -widthG/4-margin.left)
  .attr("y", heightG + (margin.bottom) - 2)
  .attr("text-anchor", "start")
  .text(source)
  .style("font-size", "12px")

  function dummyFunction(){
  }
}
