var map;
var zoomLev = 4;



$(document).ready(function(){
	Parse.initialize("anMXyXSJx6d4Gq2AX5EZHCUt1XXLMv2GK9RIpNnL", "fIWlKdHonuiNySvHXsesopC1m3lVkPPaZCuw4xus");


	initMap(35.901258, -79.172182, 43.901258, -71.172182, 2000);
	zoomLev = 1;
	$("#statsBoard").hide();
	$("#playersBoard").hide();

	$("#findGame").click(function(){
		$("#beginMap").click(function(){
			loadUsers($("#gameIdHolder").val());
			plotPoints($("#gameIdHolder").val());
			
		});

		 $("#gameFindDiv").hide();

		findMap();
	});


	
});

function findMap(){
	alert($("#gameIdHolder").val());
	var GameScore = Parse.Object.extend("Matches");
	var query = new Parse.Query(GameScore);
	query.equalTo("gameKey", $("#gameIdHolder").val());
	query.find({
	  success: function(results) {
	    //alert("Successfully retrieved " + results.length + " scores.");
	    // Do something with the returned Parse.Object values

	    if(results.length != 1){
	    	$("#gameFindDiv").show();
	    } else {
		    var obj = results[0];
		    initMap(obj.get("gameBounds")[1], obj.get("gameBounds")[0], obj.get("gameBounds")[1], obj.get("gameBounds")[0], obj.get("gameBounds")[2], obj);

		    $("#holder_title").html(obj.get("gameName"));
		    $("#holder_creationDate").html(obj.createdAt);
		    $("#holder_ownerName").html(obj.get("owner"));
		    $("#holder_radius").html(obj.get("gameBounds")[2]);
	    }


		
	    
	  },
	  error: function(error) {
	  	$("#gameFindDiv").show();
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}


function initMap(x1, y1, x2, y2, r, obj) {

  gMapLoad(x1, y1, x2, y2, r, obj);
 
  $("#statsBoard").show();
  $("#playersBoard").show();
  
}

function gMapLoad(x1, y1, x2, y2, r, obj){
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

	$("#holder_northEastPoint").html( "North East Point: <br>(" + Math.round(map.getBounds().getNorthEast().lng()*1000)/1000 + ", " + Math.round(map.getBounds().getNorthEast().lat()*1000)/1000 + ")");
	$("#holder_southWestPoint").html( "South West Point: <br>(" + Math.round(map.getBounds().getSouthWest().lng()*1000)/1000 + ", " + Math.round(map.getBounds().getSouthWest().lat()*1000)/1000 + ")");



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

	$("#holder_centerPoint").html("Center: (" + centerX + "px, " + centerY + "px)");

  	overlayLoad(centerX, centerY, horiz, vertic, r, obj);

     
  });


}

function overlayLoad(centerX, centerY, horiz, vertic, r, obj){

	var c=document.getElementById("mapOverlay");
	c.width = window.innerWidth;
	c.height = window.innerHeight;

	var ctx=c.getContext("2d");
	ctx.beginPath();
	ctx.lineWidth = 4;
	ctx.arc(0,0,50,0,2*Math.PI);
	ctx.fillStyle = "Color.white";
	ctx.stroke();

	addCenter(centerX, centerY, horiz, vertic, r, obj);

	
	
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

function addCenter(centerX, centerY, horiz, vertic, r, obj){
	var scale = window.innerWidth / horiz * zoomLev;
	//alert(scale);
	//alert(horiz);
	
	var radius = r * scale;
	//alert("Horizontal Distance = " + horiz/zoomLev + "\nVertical Distance = " + vertic/zoomLev);

	while(radius < window.innerHeight/5){
		zoomLev++;
		map.setZoom(zoomLev);

		x1 = map.getBounds().getNorthEast().lat();
	 	y1 = map.getBounds().getNorthEast().lng();
		x2 = map.getBounds().getSouthWest().lat();
		y2 = map.getBounds().getSouthWest().lng();

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

var ycordOLD;
var xcordOLD;
var amex;
var stepCount = 1;

var results;

function plotPoints(game){
	var GameScore = Parse.Object.extend("MatchInfo");
	var query = new Parse.Query(GameScore);
	query.equalTo("gameKey", game);
	query.find({
	  success: function(results) {
	    //alert("Successfully retrieved " + results.length + " scores.");
	    // Do something with the returned Parse.Object values

	    //var zerox = step(results1);
	 
	    	setInterval(function(){step(results);}, 3000);
	    
	    

	   	/*x1 = map.getBounds().getNorthEast().lat(); // lat
	 	y1 = map.getBounds().getNorthEast().lng(); // long
		x2 = map.getBounds().getSouthWest().lat();
		y2 = map.getBounds().getSouthWest().lng();

		var c=document.getElementById("mapOverlay");
		var ctx=c.getContext("2d");

	    for(var i = 0; i < results.length; i++){
	    	var obj = results[i];

	    	var locArr = obj.get("locations");
	    	
	    	var randR = Math.round(Math.random() * 255);
	    	var randG = Math.round(Math.random() * 255);
	    	var randB = Math.round(Math.random() * 255);
	    	var randA = 1;

	    	var newColor = "rgba(" + randR + "," + randG + "," + randB + "," + randA + ")";
	    	console.log(newColor);

	    	obj.set("color", newColor);
	    	$("#holder_color" + obj.get("user")).css("background-color", newColor);
			
	    	obj.save();

	    	ycordOLD = (locArr[1][0]-y1)/(y2-y1) * window.innerHeight ; //long
	    	var xcordOLD = (locArr[1][1]-x1)/(x2-x1) * window.innerWidth ; //lat


	    	//for(amex = 0; amex < locArr.length; ){
	    		
				
			var ycord = (locArr[amex][0]-y1)/(y2-y1) * window.innerHeight ; //long
			var xcord = (locArr[amex][1]-x1)/(x2-x1) * window.innerWidth ; //lat

			console.log(xcord, ycord);

			ctx.beginPath();
			ctx.moveTo(xcordOLD,ycordOLD);
			ctx.strokeStyle = newColor;
			ctx.lineTo(xcord,ycord);
			ctx.stroke();

			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.arc(xcord,ycord, 3 ,0,2*Math.PI);
			ctx.strokeStyle = "rgb(0,0,0)";
			ctx.stroke();
			ctx.fillStyle = newColor;
			
			ctx.fill();

			ycordOLD = ycord;
			xcordOLD = xcord;

			setTimeout(inForLoop(), 3000);
				
	    	//}
	    }*/
	    
		
	    
	  },
	  error: function(error) {
	  	$("#gameFindDiv").show();
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}

var ycordOLD;
var xcordOLD;
var colorArr = [];

var lineArr = [];

function step(results){

	
	stepCount++;

	x1 = map.getBounds().getNorthEast().lat(); // lat
 	y1 = map.getBounds().getNorthEast().lng(); // long
	x2 = map.getBounds().getSouthWest().lat();
	y2 = map.getBounds().getSouthWest().lng();

	var c=document.getElementById("mapOverlay");
	var ctx=c.getContext("2d");	


	var add = true;
	var g;
	for(g = 0; g < results.length; g++){
		for(var j = 0; j < lineArr.length; j++){
			if(lineArr[j][0] == results[g].get("user")){
				add = false;
			}
		}
		if(add){
		var obj = results[g];
		var a = [obj.get("user") + "",0 + obj.get("locations")[0][0], 0 + obj.get("locations")[0][1], 0];
		lineArr.push(a);
	}
	
		
	}

	
	console.log(lineArr);

	var lineI;

	for(var lineI = 0; lineI < results.length; lineI++){
		for(j = 0; j < lineArr.length; j++){
			if(results[lineI].get("user") == lineArr[j][0]){
				break;
			}
		}


		var obj = results[lineI];

		var locArr = obj.get("locations");
		
		var randR = Math.round(Math.random() * 255);
		var randG = Math.round(Math.random() * 255);
		var randB = Math.round(Math.random() * 255);
		var randA = 1;

		var newColor;

		var add = true;
		for(var a = 0; a < colorArr.length; a++){
			if(colorArr[a][0] == obj.get("user")){
				add = false;
			}
		}
		if(add){
			newColor = "rgba(" + randR + "," + randG + "," + randB + "," + randA + ")";
			console.log(newColor);

			obj.set("color", newColor);
			$("#holder_color" + obj.get("user")).css("background-color", newColor);

			var arr = [obj.get("user"), newColor];
			colorArr.push(arr);
		} else {
			for(var a = 0; a < colorArr.length; a++){
				if(colorArr[a][0] == obj.get("user")){
					newColor = colorArr[a][1];
				}
			}
		}
		
		obj.save();

		var ycord = (locArr[stepCount][0]-y1)/(y2-y1) * window.innerHeight ; //long
		var xcord = (locArr[stepCount][1]-x1)/(x2-x1) * window.innerWidth ; //lat

	ctx.beginPath();
		ctx.moveTo(lineArr[lineI][1],lineArr[lineI][2]);
		
		ctx.strokeStyle = newColor;
		ctx.lineTo(xcord,ycord);
		ctx.stroke();

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.arc(lineArr[lineI][1],lineArr[lineI][2], 5 ,0,2*Math.PI);
		ctx.strokeStyle = "rgb(0,0,0)";
		ctx.stroke();
		ctx.fillStyle = newColor;

		if(stepCount >= 1)
			lineArr[lineI][3] += returnMilesDistance(locArr[stepCount-1][0], locArr[stepCount-1][1], locArr[stepCount][0], locArr[stepCount][1]);

		$("#holder_distance" + obj.get("user")).html(Math.round(lineArr[lineI][3]/10*100)/100 + " Miles");
		
		$("#holder_lng" + obj.get("user")).html(Math.round(locArr[stepCount][0] * 10000) / 10000);
		$("#holder_lat" + obj.get("user")).html(Math.round(locArr[stepCount][1] * 10000) / 10000);

		$("#holder_calsBurned" + obj.get("user")).html(Math.round(lineArr[lineI][3]/10*100)/100 * 64 + " Calories");

		ctx.fill();

		lineArr[lineI][1] = xcord;
		lineArr[lineI][2] = ycord;

		console.log(lineArr[lineI][0] + " " + lineArr[lineI][1] + " " + lineArr[lineI][2]);


		if(stepCount < 1){
			lineArr[lineI][2] = (locArr[1][0]-y1)/(y2-y1) * window.innerHeight ; //long
			lineArr[lineI][1] = (locArr[1][1]-x1)/(x2-x1) * window.innerWidth ; //lat
		}

		//for(amex = 0; amex < locArr.length; ){
			
			
		

		//console.log(xcord, ycord);
	
		
	}
}

function returnMilesDistance(x1, y1, x2, y2){
	var dlon = y2 - y1 ;
	var dlat = x2 - x1 ;
	var a = Math.pow((Math.sin(dlat/2)),2) + Math.cos(x1) * Math.cos(x2) * Math.pow((Math.sin(dlon/2)),2);
	var c = 2 * Math.atan( Math.sqrt(a), Math.sqrt(1-a) ); 
	var d = 3959 * c;

	if(d > 0)
		return d;
	else
		return 0;
}

function loadUsers(game){
	console.log("LOADING USERS");
	var GameScore = Parse.Object.extend("MatchInfo");
	var query = new Parse.Query(GameScore);
	query.equalTo("gameKey", game);
	query.find({
	  success: function(results) {
	    console.log("Successfully retrieved " + results.length + " scores.");
	    // Do something with the returned Parse.Object value
	    $("#playerHolder").html("");
	    for(var i = 0; i < results.length; i++){
	    	var obj = results[i];

	    	$("#playerHolder").html($("#playerHolder").html() +  
	    		"<div class=\"panel panel-default\">"+
	    		"<div class=\"panel-body\">"+"<div class=\"list-group\" style=\"text-align: center;\">"+
	    		"<a class=\"list-group-item active\"  style=\"background-color: white; color: black;\">"+
	    		obj.get("user") +"<br><span class=\"label label-warning\" id=\"holder_color" + obj.get("user") + "\"> Seeker</span>  <br>"+
	    		"</a>"+
	    		"<a class=\"list-group-item\"> <span class=\"badge\" id=\"holder_lng" + obj.get("user") + "\"></span> <span class=\"badge\" id=\"holder_lat" + obj.get("user") + "\"></span> <br>"+
	    		"</a>"+
	    		"<a href=\"#\" class=\"list-group-item\"> <span class=\"label label-success\" id=\"holder_distance" + obj.get("user") + "\"> </span> <span class=\"label label-danger\" id=\"holder_calsBurned" + obj.get("user") + "\"> </span>"+
	    		"</a>"+
	    		"</div>"+"</div>"+
	    		"</div>")
	    }
	    
		
	    
	  },
	  error: function(error) {
	  	$("#gameFindDiv").show();
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}
