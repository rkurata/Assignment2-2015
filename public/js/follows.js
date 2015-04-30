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

showProgress();

(function() {
  $.getJSON( '/igMediaCounts')
    .done(function( data ) {
    var yCounts = data.users.map(function(item){
        return item.counts.followed_by;
      });

      // var xCounts = data.users.map(function(item){
      //   return item.username;
      // });

    var username = data.users.map(function(item) {
      return item.username;
    });
      
      yCounts.unshift('Media Count');

      var chart = c3.generate({
        bindto: '#chart',
        data: {
          columns: [
            yCounts 
          ], 
          type: 'scatter'
       
        }, 

        axis: {
          x: {
            type: 'category',
            categories: username,
            label: "Who you're following",
            tick: {
              rotate: 75,
              multiline: false
            },
            height: 130
          },
         y: {
          label: "Followers of who you're following"
         }
          }
        
      });
    });
})();

hideProgress();