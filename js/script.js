$(document).ready(function(){
	initMap(39.901258, -75.172182, -73.2, -77.2, 10);
});


function initMap(x1, y1, x2, y2, r) {
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

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: {lat: (x1), lng: (y1)},  
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
    }
  });

  map.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true, panControl: false, streetViewControl: false});
  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);
}
