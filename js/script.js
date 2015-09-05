var map;
var zoomLev = 4;

$(document).ready(function(){
	Parse.initialize("anMXyXSJx6d4Gq2AX5EZHCUt1XXLMv2GK9RIpNnL", "fIWlKdHonuiNySvHXsesopC1m3lVkPPaZCuw4xus");

	$("#findGame").click(function(){
		loadMatch();
	})

	initMap(35.901258, -79.172182, 43.901258, -71.172182,20);
	$("#statsBoard").hide();
	$("#playersBoard").hide();
});

function loadMatch(){
	var GameScore = Parse.Object.extend("Matches");
	var query = new Parse.Query(GameScore);
	query.equalTo("gameKey", $("#gameIdHolder").val());
	query.find({
	  success: function(results) {
	    alert("Successfully retrieved " + results.length + " scores.");
	    // Do something with the returned Parse.Object values
	    
		var obj = results[0];
		
		initMap(obj.get("gameBounds")[1], obj.get("gameBounds")[0], obj.get("gameBounds")[1], obj.get("gameBounds")[0],obj.get("gameBounds")[2]);
		$("#gameFindDiv").hide();
		$("#statsBoard").show();
		$("#playersBoard").show();

	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}


function initMap(x1, y1, x2, y2, r) {
  gMapLoad(x1, y1, x2, y2, r);
  
}

function gMapLoad(x1, y1, x2, y2, r){
	var customMapType = new google.maps.StyledMapType([
      {
        stylers: [
          {hue: '#74B0A9'},
          {visibility: 'simplified'},
          {gamma: 1},
          {weight: 3}
        ]
      },
      {
        elementType: 'labels',
        stylers: [{visibility: 'off'}]
      },
      {
        featureType: 'water',
        stylers: [{color: '#498287'}]
      }
    ], {
      name: 'Signa Style'
  });
  var customMapTypeId = 'custom_style';

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: zoomLev,
    center: {lat: (x1+x2)/2, lng: (y1+y2)/2},  
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
    }
  });

  map.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true, panControl: false, streetViewControl: false});
  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);

  google.maps.event.addListener(map, 'bounds_changed', function() {
  	x1 = map.getBounds().getNorthEast().lat();
 	y1 = map.getBounds().getNorthEast().lng();
	x2 = map.getBounds().getSouthWest().lat();
	y2 = map.getBounds().getSouthWest().lng();
	
	var dlon = y2 - y2 ;
	var dlat = x2 - x1 ;
	var a = Math.pow((Math.sin(dlat/2)),2) + Math.cos(x1) * Math.cos(x2) * Math.pow((Math.sin(dlon/2)),2);
	var c = 2 * Math.atan( Math.sqrt(a), Math.sqrt(1-a) ); 
	var d = 3959 * c;
	var horiz =  d;

	var dlon = y2 - y1 ;
	var dlat = x2 - x2 ;
	var a = Math.pow((Math.sin(dlat/2)),2) + Math.cos(x1) * Math.cos(x2) * Math.pow((Math.sin(dlon/2)),2);
	var c = 2 * Math.atan( Math.sqrt(a), Math.sqrt(1-a) ); 
	var d = 3959 * c;
	var vertic = d ;

	var centerX = window.innerWidth /2;
	var centerY = window.innerHeight /2;

  	overlayLoad(centerX, centerY, horiz, vertic, r);
     
  });
}

function overlayLoad(centerX, centerY, horiz, vertic, r){

	var c=document.getElementById("mapOverlay");
	c.width = window.innerWidth;
	c.height = window.innerHeight;

	var ctx=c.getContext("2d");
	

	addCenter(centerX, centerY, horiz, vertic, r);
}

function setScale(integer){
	if(integer < 10){
		return 1;
	} else if (integer < 100){
		return 10;
	} else if (integer < 1000){
		return 100;
	} else if (integer < 10000){
		return 1000;
	} else if (integer < 100000){
		return 10000;
	}
}

function addCenter(centerX, centerY, horiz, vertic, r){
	var scale = window.innerWidth / horiz * zoomLev;
	//alert(scale);
	//alert(horiz);
	
	var radius = r * scale;
	//alert("Horizontal Distance = " + horiz/zoomLev + "\nVertical Distance = " + vertic/zoomLev);

	while(radius < window.innerHeight/3){
		zoomLev++;
		map.panTo();
		map.setZoom(zoomLev);

		var dlon = y2 - y2 ;
		var dlat = x2 - x1 ;
		var a = Math.pow((Math.sin(dlat/2)),2) + Math.cos(x1) * Math.cos(x2) * Math.pow((Math.sin(dlon/2)),2);
		var c = 2 * Math.atan( Math.sqrt(a), Math.sqrt(1-a) ); 
		var d = 3959 * c;
		horiz =  d;

		var dlon = y2 - y1 ;
		var dlat = x2 - x2 ;
		var a = Math.pow((Math.sin(dlat/2)),2) + Math.cos(x1) * Math.cos(x2) * Math.pow((Math.sin(dlon/2)),2);
		var c = 2 * Math.atan( Math.sqrt(a), Math.sqrt(1-a) ); 
		var d = 3959 * c;
		vertic = d ;

		scale = window.innerHeight / horiz * zoomLev;
		radius = r * scale;
		
	}


	var c=document.getElementById("mapOverlay");
	c.width = window.innerWidth;
	c.height = window.innerHeight;

	var ctx=c.getContext("2d");
	ctx.beginPath();
	ctx.lineWidth = 4;
	ctx.arc(centerX,centerY, radius ,0,2*Math.PI);
	ctx.strokeStyle = "rgb(255,255,255)";
	ctx.stroke();
	ctx.fillStyle = "rgba(51, 204, 255,0.1)";
	ctx.fill();

}
