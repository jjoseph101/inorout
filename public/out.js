//Initialize Firebase
 var config = {
   apiKey: "AIzaSyAI6FT3WrhdqXUjwkaW-d2osyPasRYlScQ",
   authDomain: "in-or-out-8b800.firebaseapp.com",
   databaseURL: "https://in-or-out-8b800.firebaseio.com",
   storageBucket: "in-or-out-8b800.appspot.com",
   messagingSenderId: "141868409337"
 };
 
 firebase.initializeApp(config);

var database = firebase.database();
//


// begin console log
console.log("Recipes 'In' Testing")

// begin javascript code
$(document).ready(function(){

        database.ref().on('value', function(snapshot) {
            console.log(snapshot.val());

        });
console.log("Out Testing");


var terms = "";
var near = "";
//var URL = "http://localhost:5001/yelp/search?term="+terms+"&location="+near;


//event listener Submit

$("#submit").on("click", function(){

	//data
	terms = $("#terms").val().trim();
	near = $("#near").val().trim();


	//test
	console.log("Cuisine: " + terms);
	console.log("Location: " + near);

	//display Search Criteria on HTML page
	$("#searchCrit").empty();
	$("#searchCrit").append("SEARCH CRITERIA" + "<BR>");
	$("#searchCrit").append("Cuisine: " + terms + "<BR>");
	$("#searchCrit").append("Location: " + near + "<BR>");


// check to make sure user inputs minimal search criteria
		if (terms==="" && near==="") {
			$(".results").html("You must input a Cuisine and Location selection" + "<BR>" + "Please try again");
			return false;
		};

//set meat search to null if not input by user
		if (terms==="") {
			termZ="";
		} else {
			termZ=terms;
		}

		//set location search to null if not input by user
		if (near==="") {
			nearZ="";
		} else if (terms!=="") {
			nearZ="," + near;
		} else {
			nearZ=near;
		}

		console.log(near);

		// set up API url
		var queryURL = "http://localhost:5001/yelp/search?term="+termZ+"&location="+ nearZ+"&from=0&to=20";
		console.log("queryURL: " + queryURL); 


		// ajax api call
		$.ajax({url: queryURL, method: "GET"}).done(function(response){
			var results =  response.businesses;
			console.log(response);
			console.log("RESULTS:");
			console.log(results);
			console.log(results.length);
			console.log(near);
			// display total number of recipes returned
			//$("#searchCrit").prepend("RESULTS RETURNED: " + results.length + "<BR>" + "<BR>");

			// clear results div
			$(".results").empty();

			// display results loop
			for (var i=0; i<results.length; i++) {


			//local variables

			var restaurantDiv = $("<div>");
			var restaurantName = results[i].name;
			var restaurantImg = $("<img>");
			var restaurantImageURL = results[i].image_url;
			var ratingImg = $("<img>");
			var ratingImageURL = results[i].rating_img_url;
			var neighborhood = results[i].location.neighborhoods;
			var neighborhood_display = $("<p>").text("Neighborhood: " + neighborhood);
			var phone = results[i].display_phone;
			var ph = $("<p>").text("Phone: " + phone);
			var address = results[i].location.address;
			var address_display = $("<p>").text(" " + address + " ");
			var city = results[i].location.city;
			var state = results[i].location.state_code;
			var zipcode = results[i].location.postal_code;
			var p = $("<p>").text("RESTAURANT #" + (i+1) + ": " + restaurantName);
			var restaurantID = results[i].id;
			var restaurantVotes = 0;
			console.log(restaurantName);

			//test local variables

			console.log ("------------------------");
			console.log("Restaurant " + (i+1));
			console.log(restaurantName);


				

			//create button
			var b = $("<button>").text("Recommend");
			b.attr("style", "display: block; margin-top:20px; margin-left:120px; margin-bottom:20px; color: white; padding:10px; border-color:black; background-color:black");
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
			$(".voteShow2").css({"margin-left":"70px","margin-bottom":"10px"});

			//populate HTML
			restaurantImg.attr("src", restaurantImageURL);
			restaurantImg.attr("style", "float:left; margin:10px; position:relative;");
			restaurantImg.attr("class", "pics");
			p.attr("style", "font-weight: bold; clear:both;");
			p.attr("class", "panel-heading");
			ratingImg.attr("src", ratingImageURL);
			//ratingImg.attr("style", "float:right; margin:10px; position:relative;");
			ratingImg.attr("class", "pics");
			$(restaurantDiv).append(p);
			$(restaurantDiv).append(restaurantImg);
			//$(restaurantDiv).append(p);
			$(restaurantDiv).append(ratingImg);
			$(restaurantDiv).append(neighborhood_display);
			$(restaurantDiv).append(ph);
			$(restaurantDiv).append(address_display);
			$(restaurantDiv).append(city + ", " + state + ", " + zipcode);
			$(restaurantDiv).append(b);
			$(restaurantDiv).append(retrieving);
			$(".results").append(restaurantDiv);


			

		}
	});

		// prevent refresh
		return false;
	});

$(document).on("click", ".voteButton", function(){

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

});

