var map;

$(document).ready(function(){
	initMap(37.901258, -77.172182, 41.901258, -73.172182, 10);
});


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
    zoom: 18,
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
	ctx.beginPath();
	ctx.lineWidth = 4;
	ctx.arc(0,0,50,0,2*Math.PI);
	ctx.fillStyle = "Color.white";
	ctx.stroke();

	addCenter(centerX, centerY, horiz, vertic, r);
}

function addCenter(centerX, centerY, horiz, vertic, r){
	alert(horiz / window.innerWidth);

	var c=document.getElementById("mapOverlay");
	c.width = window.innerWidth;
	c.height = window.innerHeight;

	var ctx=c.getContext("2d");
	ctx.beginPath();
	ctx.lineWidth = 4;
	ctx.arc(centerX,centerY,50,0,2*Math.PI);
	ctx.strokeStyle = "rgb(255,255,255)";
	ctx.stroke();

}
