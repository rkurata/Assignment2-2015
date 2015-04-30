var margin = {bottom: 200}

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

var diameter = 750
    //format = d3.format(",d"),
    //color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5)

    .value (function(d) {
      return d.likes;
    })

var svg = d3.select("#likeschart").append("svg")
    .attr("width", diameter)
    .attr("height", diameter);
showProgress();

d3.json('/iglikes', function(error, root) {
  console.log(root);
    var nodes = bubble.nodes ({children: root.likes})
    .filter(function(d) {return !d.children;});

    var vis = svg.selectAll('circle')
    .data(nodes, function(d) {return d.text;});

    vis.enter()
    .append('pattern')
    .attr('id', function(d) {
      return d.id;
    })
    .attr('width', '100%')
    .attr('height', '100%')
    .append('image')
    .attr('xlink:href', function(d) {
      return d.img;
    })
    .attr('x', '0')
    .attr('y', '0')
    .attr('width', function(d) {
      return d.r*2;
    })
    .attr('height', function(d) {
      return d.r*2;
    })

    vis.enter()
    .append('circle')
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    })
    .attr('r', function(d) {
      return d.r;
    })
    .attr('fill', function(d) {
      return 'url(#' + d.id + ')';
    })
    .on('mouseover', function(d) {showPop.call(this, d);})
    .on('mouseout', function(d) {removePop(); });
  //  .attr('stroke', 'black')
  //  .attr('stroke-width', '1');

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
          return "Likes: " + d.likes;
        }
      });
      $(this).popover('show')
    }


  })


// Returns a flattened hierarchy containing all leaf nodes under the root.
