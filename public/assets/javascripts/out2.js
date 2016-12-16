//Initialize Firebase

  var config = {
    apiKey: "AIzaSyD012qFa7FrVIXpP0O7miuo-6wxqrMeW0U",
    authDomain: "out-yelp.firebaseapp.com",
    databaseURL: "https://out-yelp.firebaseio.com",
    storageBucket: "out-yelp.appspot.com",
    messagingSenderId: "964383377823"
  };
  firebase.initializeApp(config);

var database = firebase.database();
//


// begin console log
console.log("Restaurant 'In' Testing")


// begin javascript code
$(document).ready(function(){

		database.ref().on('value', function(snapshot) {
			
			console.log(snapshot.val());

	});

 //Global Variables
	var terms = "";
	var nearCity = "";
	var nearState = "";

function displaySearch(){
	// display search criteria on HTML page
		$("#searchCrit").empty();
		$("#searchCrit").append("SEARCH CRITERIA" + "<BR>");
		$("#searchCrit").append("Cuisine: " + terms + "<BR>");
		$("#searchCrit").append("Location: " + nearCity +", "+nearState + "<BR>");

};

function getURL(){

	// check to make sure user inputs minimal search criteria
		if (terms==="" || nearCity==="" || nearState==="") {
			
			$(".results").html("You must input a Cuisine, City and State selection" + "<BR>" + "Please try again");
			
			return false;
		};

	//set cuisine search to null if not input by user
		
		if (terms==="") {

			termZ="";

		} else {

			termZ=terms;
		}

		//set location search to null if not input by user
		if (nearCity==="") {

			nearCityZ="";

		}if (nearState==="") {

			nearStateZ="";

		} else if (terms!=="") {
			
			console.log(nearState);	
			nearCityZ = nearCity + ",";
			nearStateZ = nearState;
				
		}

		// set up API url
		var queryURL = "http://localhost:5001/yelp/search?term="+termZ +"&location="+ nearCityZ +nearStateZ+"&from=0&to=20";
		console.log("queryURL: " + queryURL); 


		ajaxCall(queryURL);

};


function DOMchange(restaurantImageURL, ratingImageURL, neighborhood, phone, address, restaurantName, yelpURL, restaurantID, restaurantVotes, i, city, state, zipcode){

	
			var restaurantDiv = $("<div>");
			var restaurantImg = $("<img>");
					restaurantImg.attr("src", restaurantImageURL);
					restaurantImg.attr("style", "width:200px; height:200px; float:left; margin:10px 20px 10px 10px; position:relative;");
					restaurantImg.attr("class", "pics");
			var ratingImg = $("<img>");
					ratingImg.attr("src", ratingImageURL);
					ratingImg.attr("class", "pics");		
			var neighborhood_display = $("<p>").text("Neighborhood: " + neighborhood);
			var ph = $("<p>").text("Phone: " + phone);
			var address_display = $("<p>").text(" " + address + " ");			
			var p = $("<p>").text(restaurantName);
					p.attr("style", "font-weight: bold; clear:both;");
					p.attr("class", "panel-heading restaurantHeading");
					p.attr("onclick", "location.href='"+yelpURL+"';");
					


			//test local variables

			console.log ("------------------------");
			console.log("Restaurant " + (i+1));
			console.log(restaurantName);


				

			//create button
			var b = $("<button>").text("Recommend");
					b.attr("style", "display: block;margin-right:50px; margin-top:10px; margin-bottom:10px; color:white; padding:10px; border-color:black; background-color:black");
					b.attr("type", "button");
					b.val(restaurantID);
					b.addClass("voteButton");
					b.attr("data", [i]);

			
			database.ref().on("value", function(snapshot) {
				console.log(snapshot);

				if(snapshot.child(restaurantID).exists()){
					
					restaurantVotes = snapshot.child(restaurantID).val().votes;
				};

			});

			var retrieving = $("<p>").html("Recommended By: " + restaurantVotes);
					retrieving.attr("id", [i]);
					retrieving.addClass("voteShow2");
					

			//populate HTML
			$(restaurantDiv).append("</br>");
			$(restaurantDiv).append(p);
			$(restaurantDiv).append("</br>");
			$(restaurantDiv).append(restaurantImg);
			$(restaurantDiv).append(ratingImg);
			$(restaurantDiv).append("</br>");
			$(restaurantDiv).append("</br>");
			$(restaurantDiv).append(neighborhood_display);
			$(restaurantDiv).append(ph);
			$(restaurantDiv).append(address_display);
			$(restaurantDiv).append(city + ", " + state + ", " + zipcode);
			$(restaurantDiv).append(b);
			$(restaurantDiv).append(retrieving);
			$(restaurantDiv).append("</br>");
			
			$(".results").append(restaurantDiv);


}

function ajaxCall(queryURL){

// ajax api call
	$.ajax({url: queryURL, method: "GET"}).done(function(response){
			
		var results =  response.businesses;
			
	
		// display results loop
		for (var i=0; i<results.length; i++) {


			//local variables
			var restaurantName = results[i].name;
			var restaurantImageURL = results[i].image_url;
			var ratingImageURL = results[i].rating_img_url;
			var neighborhood = results[i].location.neighborhoods;
			var phone = results[i].display_phone;
			var address = results[i].location.address;
			var city = results[i].location.city;
			var state = results[i].location.state_code;
			var zipcode = results[i].location.postal_code;
			var restaurantID = results[i].id;
			var restaurantVotes = 0;
			console.log(restaurantName);
			var yelpURL = results[i].url;
			console.log(yelpURL);

			//calling DOM function
			DOMchange(restaurantImageURL, ratingImageURL, neighborhood, phone, address, restaurantName, yelpURL, restaurantID, restaurantVotes, i, city, state, zipcode);
	
		}
	});//.done call
	.fail(function(){

		$(".results").html("<h1>We are experiencing some technical issue right now. Please try again later.</h1>");

	})//.fail
}



$(document).on("click","#submit", function (event){

	event.preventDefault();

		$(".results").empty();

	// grab data
		terms = $("#terms").val().trim();
		nearCity = $("#nearCity").val().trim();
		nearState = $("#nearState").val().trim();

	//emptying textbox
		$("#terms").val("");
		$("#nearCity").val("");
		$("#nearState").val("");


		displaySearch();
		
		//ajaxCall();
		getURL();

	//prevent refresh
	return false;

});

$(document).on("click",".voteButton", function(event){
		event.preventDefault();
		
		var resultID = $(this).val().trim();
		var pID = $(this).attr("data");

		var voteCount;

		console.log(resultID);

		database.ref().once("value").then(function(snapshot) {

			voteCount = (snapshot.child(resultID).exists() ? snapshot.child(resultID).val().votes : 0);
			voteCount++

				console.log(voteCount);

			database.ref(resultID).update({
				votes: voteCount
			});

		$("#" + pID).html("Recommended by: " + voteCount);

	});

	return false;

});

});//ready

