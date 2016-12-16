//Initialize Firebase

  var config = {
    apiKey: "AIzaSyD012qFa7FrVIXpP0O7miuo-6wxqrMeW0U",
    authDomain: "out-yelp.firebaseapp.com",
    databaseURL: "https://out-yelp.firebaseio.com",
    storageBucket: "out-yelp.appspot.com",
    messagingSenderId: "964383377823"
  };
  firebase.initializeApp(config);

//firebase reference
var database = firebase.database();

// begin console log
console.log("Restaurant 'In' Testing")


// Ready wrap the whole code
$(document).ready(function(){

	//initialized firebase to retrieve data
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
		var queryURL = "/yelp/search?term="+termZ +"&location="+ nearCityZ +nearStateZ+"&from=0&to=20";
		console.log("queryURL: " + queryURL); 

		//call the ajax function
		ajaxCall(queryURL);

};

//using this function to dynamically display in html element in the browser
function DOMchange(restaurantImageURL, ratingImageURL, neighborhood, phone, address, restaurantName, yelpURL, restaurantID, restaurantVotes, i, city, state, zipcode){

			//container div of each restuarant
			var restaurantDiv = $("<div>");

			//create the image tag and set the attribute url, css style and add the class 
			var restaurantImg = $("<img>");
					restaurantImg.attr("src", restaurantImageURL);
					restaurantImg.attr("style", "width:200px; height:200px; float:left; margin:10px 20px 10px 10px; position:relative;");
					restaurantImg.attr("class", "pics");
			//create the image tag and set the attribute url, css style and add the class 
			var ratingImg = $("<img>");
					ratingImg.attr("src", ratingImageURL);
					ratingImg.attr("class", "pics");		
			//create the p tag for the neighborhood
			var neighborhood_display = $("<p>").text("Neighborhood: " + neighborhood);
			//create the p tag for the phone
			var ph = $("<p>").text("Phone: " + phone);
			//create the p tag for the address
			var address_display = $("<p>").text(" " + address + " ");			
			//create the p tag for the restuarant name
			var p = $("<p>").text(restaurantName);
					p.attr("style", "font-weight: bold; clear:both;");
					p.attr("class", "panel-heading restaurantHeading");
					p.attr("onclick", "location.href='"+yelpURL+"';");
					


			//test local variables

			console.log ("------------------------");
			console.log("Restaurant " + (i+1));
			console.log(restaurantName);


				

			//create the button and set the value to the recipe name, add class, add css style
			var b = $("<button>").text("Recommend");
					b.attr("style", "display: block;margin-right:50px; margin-top:10px; margin-bottom:10px; color:white; padding:10px; border-color:black; background-color:black");
					b.attr("type", "button");
					b.val(restaurantID);
					b.addClass("voteButton");
					//set the unique data attribute to each button
					b.attr("data", [i]);

			//function databseRetrieve to retrieve the votes of each recipe
			database.ref().on("value", function(snapshot) {
				console.log(snapshot);

				if(snapshot.child(restaurantID).exists()){
					
					// Pickup the number of votes for the recipe
					restaurantVotes = snapshot.child(restaurantID).val().votes;
				};

			});

			//create the p tag to contain the retreived vote fromt the database
			var retrieving = $("<p>").html("Recommended By: " + restaurantVotes);
					//set the unique id to each paragraph to match the data attr of the button	
					retrieving.attr("id", [i]);
					//add class	
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
//to auto scroll to the reults
function showDiv(){
	 $('html, body').animate({
        	scrollTop: $("#forScroll").offset().top
      }, 2000);

}

//make ajax call function
function ajaxCall(queryURL){

// ajax api call
	$.ajax({url: queryURL, method: "GET"}).done(function(response){
			
		//create the variable to refer to the json object		
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
		//auto scroll to the result
		showDiv();
	});//.done call
	
}

//on click function
$(document).on("click","#submit", function (event){

	//prevent refresh
	event.preventDefault();

		//empty the content in the div
		$(".results").empty();

	// grab data
		terms = $("#terms").val().trim();
		nearCity = $("#nearCity").val().trim();
		nearState = $("#nearState").val().trim();

	//emptying textbox
		$("#terms").val("");
		$("#nearCity").val("");
		$("#nearState").val("");

		//call this function to show search criteria in the browser
		displaySearch();
		
		//ajaxCall();
		getURL();

	//prevent refresh
	return false;

});

//on click function
$(document).on("click",".voteButton", function(event){
		
		//prevent refresh
		event.preventDefault();
				//set a local vairable to store the recipe name which is the value form the button
				var resultID = $(this).val().trim();
				//set the local variable to store the data attr of the button whic is the [i]
				var pID = $(this).attr("data");
				//set local variable for voteCount		  	
				var voteCount;

		console.log(resultID);
				
				//acessing database once
				database.ref().once("value").then(function(snapshot) {
					//retrieve the value of the voteCount from the database		
					voteCount = (snapshot.child(resultID).exists() ? snapshot.child(resultID).val().votes : 0);
					//then increase the voteCount	
					voteCount++

						console.log(voteCount);
					//store the new voteCount to the database	  	
					database.ref(resultID).update({
						votes: voteCount
				});
			
			//display the voteCount in the browser ,, target the div using the id which is the same as pID variable			
			$("#" + pID).html("Recommended by: " + voteCount);

	});

	return false;

});

});//ready

