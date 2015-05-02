var margin = {top: 20, right: 20, bottom: 100, left: 250};
var width = 1000;
var height = 550 - margin.top - margin.bottom;
var background-color = #ffffff


var spinnerVisible = false;
function showProgress() {
  if (!spinnerVisible) {
    $("div#spinner").fadeIn("fast");
    spinnerVisible = true;
  }
}
function hideProgress() {
  if (spinnerVisible) {
    var spinner = $("div#spinner");
    spinner.stop();
    spinner.fadeOut("fast");
    spinnerVisible = false;
  }
}
//define scale of x to be from 0 to width of SVG, with .1 padding in between
var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1, 1);

//define scale of y to be from the height of SVG to 0
var y = d3.scale.linear()
  .range([height, 0]);

//define axes
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

/*
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) { 
    return "<strong>Media Counts:</strong> <span style='color:black'>" +d.counts.media+ "</span>";
  });

*/
  //create svg
var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//svg.call(tip);
showProgress();

//get json object which contains media counts
d3.json('/igMediaCounts', function(error, data) {
  //set domain of x to be all the usernames contained in the data
  x.domain(data.users.map(function(d) { return d.username; }));
  //set domain of y to be from 0 to the maximum media count returned
  y.domain([0, d3.max(data.users, function(d) { return d.counts.media; })]);

  //set up x axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")") //move x-axis to the bottom
    .call(xAxis)
    .selectAll("text")  
    .style("text-anchor", "start")
    .attr("dx", "0.5em")
    .attr("dy", "0.05em")
    .attr("transform", function(d) {
      return "rotate(60)" 
    });

  //set up y axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of Photos");

  //set up bars in bar graph
  svg.selectAll(".bar")
    .data(data.users)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.username); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.counts.media); })
    .attr("height", function(d) { return height - y(d.counts.media); })
    .on('mouseover', function(d) {showPop.call(this, d); })
    .on('mouseout', function(d) {removePop(); });

//codes working above this line....//

    
   d3.select("input").on("change", change);
   
   var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
   }, 50000000); 

    function change() {
      clearTimeout(sortTimeout);

      var x0 = x.domain(data.users.sort(this.checked
        ? function(a, b) { return a.counts.media - b.counts.media; }
        : function(a, b) { return d3.ascending(a.username , b.username); })
        .map(function(d) { return d.username; }))
        .copy();
    

    svg.selectAll(".bar")
      .sort(function(a, b) {return x0(a.username) - x0(b.username); });

    var transition = svg.transition().duration(500),
        delay = function(d, i) {return i * 50; };

    transition.selectAll(".bar")
      .delay(delay)
      .attr("x", function(d) { return x0(d.username); });

      

    transition.select(".x.axis")
      .call(xAxis)
      .selectAll("g")
      .selectAll("text")
      .style("text-anchor", "start")
      .attr("x", "1");
      //.attr("x", "20")
      //.attr("y", "-1");
      //.transition()
      //.attr("transform", "translate(0," + height/2 + ")");
    } 
hideProgress();

    function removePop () {
      $('.popover').each(function() {
        $(this).remove();
      });
    }

    function showPop (d) {
      $(this).popover({
        placement: 'auto top',
        container: 'body',
        trigger: 'manual',
        html: true,
        content: function () {
          return "Media Count: " + d.counts.media;
        }
      });
      $(this).popover('show')
    }


});








