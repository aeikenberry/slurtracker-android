
  
  // Local Dev an Prod switch
  var socket = io.connect('http://slurtracker.herokuapp.com/');
  //var socket = io.connect('http://localhost:3000');

  var h = $(window).height(),
      w = $(window).width();

      console.log(h);

  if (h < 550) {
    $('#stream').css("bottom", "0px");
    $('#counter-box').addClass('counter-mobile');
    $('#title').addClass('title-mobile');
    $('#about-toggle').addClass('about-mobile');
  } else {
    $('#counter-box').addClass('counter-desktop');
    $('#title').addClass('title-desktop');
    $('#about-toggle').addClass('about-desktop');
  }
  
  var nWord = 0,
      midget = 0,
      cunt = 0,
      faggot = 0,
      fag = 0;

  var style = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      { hue: "#00ff91" },
      { saturation: -99 },
      { lightness: -100 }
    ]
  },{
    featureType: "water",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  },{
    featureType: "administrative",
    stylers: [
      { visibility: "simplified" }
    ]
  },{
    featureType: "poi",
    stylers: [
      { visibility: "off" }
    ]
  },{
    featureType: "road",
    stylers: [
      { visibility: "off" }
    ]
  },{
    featureType: "administrative.country",
    stylers: [
      { visibility: "simplified" }
    ]
  },{
  }
];

  var map,
      infowindow = new google.maps.InfoWindow({
        maxWidth: 275
      }),
     geocoder = new google.maps.Geocoder();
     icon = 'http://slurtracker.com/RacistTweet_small_icon.png';

  

  socket.on('bad-reply', function (reply) {
      $('#tweet-success').html('<b>Cleaning up!</b>').fadeIn();
      setTimeout("$('#tweet-success').fadeOut()", 8000);

      console.log(reply);
  });

  socket.on('reply', function(reply) {
      console.log(reply);
      $('#tweet-success').html('<b>Making the world a better place!</b><br> ' +
                         '<a target="_blank" href="http://twitter.com/#!/' +
                         reply['user'] + '/status/' +
                         reply['id'] + '">You did this.</a>').fadeIn();
      //setTimeout("$('#tweet-success').fadeOut()", 8000);
  });

  function initialize() {
        var myOptions = {
          center: new google.maps.LatLng(35.960223, -81.386719),
          
          zoom: 2,
          
          mapTypeId: google.maps.MapTypeId.TERRAIN,
          
          mapTypeControl: true,
          mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              position: google.maps.ControlPosition.RIGHT_TOP
          },

          zoomControl: false,
          zoomControlOptions: {
              style: google.maps.ZoomControlStyle.LARGE,
              position: google.maps.ControlPosition.LEFT_CENTER
          },

          panControl: false,
          scaleControl: false,
          streetViewControl: false,
        };
        
        map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);

        map.setOptions({styles: style});
  };

  function geocode(address, callback) {
        geocoder.geocode( { 'address': address }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                callback(results[0].geometry.location);
            }
            else {
                callback("Error");
            }
        });
    };
    
  socket.on('stream', function (tweet) {
    //console.log(tweet);
    var user_img = tweet.user['profile_image_url'];
    var user_name = tweet.user['name'];
    var screen_name = tweet.user['screen_name'];
    var text = tweet['text'];

      

      if (text.indexOf('nigger') >= 0 || text.indexOf('nigruh') >= 0 || text.indexOf('niggra') >= 0
        || text.indexOf('nigra') >= 0 || text.indexOf('niglet') >= 0 || text.indexOf('nigaboo') >= 0
        || text.indexOf('niggerz') >= 0 || text.indexOf('niggers') >= 0) {

         nWord = nWord+1;
         $('#n-word-count').html(nWord); 
      }

      if (text.indexOf('midget') >= 0){
        midget = midget+1;
        $('#midget-count').html(midget);
      }

      if (text.indexOf('cunt') >= 0){
        cunt = cunt+1;
        $('#cunt-count').html(cunt);
      }

      if (text.indexOf('faggot') >= 0){
        faggot = faggot+1;
        $('#faggot-count').html(faggot);
      }

      if (text.indexOf('fag') >= 0){
        fag = fag+1;
        $('#fag-count').html(fag);
      }

      

    var tweetBox = '<div class="tweet-container" style="width:275px"; font-family: Arial "><div style="padding-right:10px;float:left;"><img src="' + 
                          user_img + '"></div><b>' + user_name + 
                          "</b> <div class='screen-name' style='font-size:small; color: #333'>" + 
                          screen_name + 
                          "</div><br><div style='padding-left:0px; font-family:Arial; font-size: 14px;'>" + 
                          text + 
                          "<!--<br><BR><form action='' name='disapprove-form' class='form'><input type='hidden' name='screen_name' value='" + 
                          screen_name + 
                          "' /><input type='hidden' name='tweet_id' value='" + 
                          tweet['id_str'] + "' /><input type='submit' value='Disapprove!' /></form><div id='tweet-success'></div>-->";

    geocode(tweet.user['location'], coded);

    function coded(location) {
      
      if (location == "Error") {

        console.log('geocode fail.');

      } else {
      
      var tweetCoordinates = new google.maps.LatLng(location['ab'], location['cb']);
      
      var marker = new google.maps.Marker({

        map: map,
        position: tweetCoordinates,
        title: text,
        icon: icon,
        animation: google.maps.Animation.DROP
      });
      
      google.maps.event.addListener(marker, 'click', function() {
 
        marker.setIcon('http://slurtracker.com/RacistTweet_small_black_icon.png');
        infowindow.setContent(tweetBox);
        infowindow.open(map,marker);
      
      });
    } // end of coded
    };

    var locale;
  
    // if they don't give a location, let's not leave it blank. 
    if (tweet.user['location'] == '' || tweet.user['location'] == null) {
      locale = "I didn't put anything!";
    } else {
      locale = tweet.user['location'];
    }

    // it's passed our tests, let's add it to the page.
    currentTweet(tweet, locale);

    function currentTweet (tweet, location) {

      $('#stream').html('<li><b>Tweet:</b> ' + text + '</li>' + 
                        '<li><b>Location:</b> ' 
                        + location + '</li>').fadeIn();
      
      //var s = setTimeout("$('#stream').fadeOut()", 3000);
      
    };
  });

// once they do the input, here's the submission handler.
$("form").live("submit", function (event) {
          event.preventDefault();

          var $this = $(this);
 
          $('form').fadeOut();
          
          var fields = $(this, ":input").serializeArray();

          var values = {};
          
          $.each($(this).serializeArray(), function(i, fields) {
            values[fields.name] = fields.value;
          });

          var screenname = values['screen_name'];
          var id = values['tweet_id'];

          socket.emit('disapprove', { user: screenname, id: id });     
          return false;
        });
// show the about text.
$('#show-about').click(function() {
  $('#about-container').slideDown(function () {
    var s = setTimeout("$('#about-container').fadeOut()", 7000);
  });

}); 