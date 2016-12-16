// Initialize Firebase
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


	// set global variables
	var appKey="7b5ada340cf0a8e379450f9e20d0a560"
	var appID="a81083ad"
	var URL="http://cors-anywhere.herokuapp.com/https://api.edamam.com/search?"
	var meats = "";
	var cuisines = "";
	var diets = "";
	var allergies = "";
	var calMins = "";
	var calMaxs = "";
	var ingredss = "";

function displaySearch(){
	// display search criteria on HTML page
		$("#searchCrit").empty();
		$("#searchCrit").append("SEARCH CRITERIA" + "<BR>");
		$("#searchCrit").append("Meat: " + meats + "<BR>");
		$("#searchCrit").append("Cuisine: " + cuisines + "<BR>");
		$("#searchCrit").append("Diet: " + diets + "<BR>");
		$("#searchCrit").append("Allergy: " + allergies + "<BR>");
		$("#searchCrit").append("Calories (min): " + calMin + "<BR>");
		$("#searchCrit").append("Calories (max): " + calMax + "<BR>");
		$("#searchCrit").append("Maximum Ingredients: " + maxIngreds + "<BR>");
		$("#searchCrit").css({"font-size":"36px"});


};

function getURL(){

	// check to make sure user inputs minimal search criteria
		if (meats=="" && cuisines=="") {
			$(".results").html("You must input either a meat selection or a cuisine selection" + "<BR>" + "Please try again");
			$(".results").css({"background-color":"white","padding":"20px","width":"553px","color":"black","margin-left":"-15px"});
			return false;
		};

		//set meat search to null if not input by user
		if (meats=="") {
			meatZ="";
		} else {
			meatZ=meats;
		};

		//set cuisine search to null if not input by user
		if (cuisines=="") {
			cuisineZ="";
		} else if (meats!="") {
			cuisineZ="," + cuisines;
		} else {
			cuisineZ=cuisines;
		};

		//set diet search to null if not input by user
		if (diets=="") {
			dietZ="";
		} else {
			dietZ="&diet=" + diets;
		};

		//set allergy search to null if not input by user
		if (allergies=="") {
			allergieZ="";
		} else {
			allergieZ="&health=" + allergies
		};

		//set calories search to null if not input by user
		if (calMin=="" & calMax=="") {
			calMinZ="";
			calMaxZ="";
		} else if (calMin=="" && calMax !="") {
			calMinZ="";
			calMaxZ="&calories=lte%20" + calMax;
		} else if (calMin!="" && calMax =="") {
			calMaxZ="";
			calMinZ="&calories=gte%20" + calMin;
		} else {
			calMinZ="&calories=gte%20" + calMin;
			calMaxZ=",%20lte%20" + calMax;
		};

		// set up API url
		var queryURL = URL + "q=" + meatZ + cuisineZ + "&from=0&to=100" + dietZ + allergieZ + calMinZ + calMaxZ;
		console.log("queryURL: " + queryURL); 

		ajaxCall(queryURL);

};


function DOMchange(recipeImageURL, recipeName, recipeVotes, maxCount, recipeTitle, recipeIngreds, instructSource, instructionsLink, calories, rICount, i){

	var recipeDiv = $("<div>");
					recipeDiv.attr("class", "panel panel-primary");
					recipeDiv.attr("style", "width: 330px; float: left; margin-right:30px; padding-left:5px; padding-right:5px; padding-bottom:10px; border-color:transparent; text-align:center;");

	var recipeImg = $("<img>");
					recipeImg.attr("src", recipeImageURL);
					recipeImg.attr("style", " position:relative; margin:15px auto;");
					recipeImg.attr("class", "pics");
//FOR GRACE	

	var b = $("<button>").text("Recommend").addClass("recommended");
					b.val(recipeName);
					b.attr("style", "display: block; margin: 0 auto 0 auto; color: white; padding:10px; border-color:black; background-color:black;");
					b.attr("type", "button");
					b.addClass("voteButton");
					b.attr("data", [i]);
					console.log("Recipe Name Before: " + recipeName);



	//function databseRetrieve

		database.ref().on('value', function(snapshot) {
			console.log(snapshot);

			console.log("Recipe Name: " + recipeName);

			  				
			 if(snapshot.child(recipeName).exists()){
		  			// Pickup the number of votes for the recipe
		  			recipeVotes = snapshot.child(recipeName).val().votes;
			  			console.log("Recipe Exists")
			  		};			  					
		  			
		  			console.log("inside" + recipeVotes)
							
		  				
		 });


	var retrieving = $("<p>").html("Recommended By: "+ recipeVotes);
					retrieving.attr("id", [i]);//
					retrieving.addClass("voteShow");
//

	var p = $("<p>").text("DISH #" + maxCount + ": " + recipeTitle);
					p.attr("style", "font-weight: 600; width: 330px;float: left; display: block; margin-left:-6px; margin-top:-1px;");
					p.attr("class", "panel-heading");
	var q = $("<p>").text(recipeIngreds);
	
	var s = $("<button>").text("Instructions").addClass("instructions");
					s.attr("onclick", "location.href="+"'"+instructionsLink+"';")
					s.attr("type", "button");
					s.attr("style", "display: block; margin: 0 auto 0 auto; color:white; padding:10px; border-color:black; background-color:black");
					
					recipeDiv.attr("id", "marginFix"+maxCount);
					recipeDiv.append(p);
					recipeDiv.append("<BR>");
					recipeDiv.append(recipeImg);
					recipeDiv.append("<BR>");
					recipeDiv.append(" CALORIES PER SERVING: " + calories);
					recipeDiv.append("<BR>");
					recipeDiv.append("<BR>");
					recipeDiv.append(" INGREDIENTS: " + rICount);
					recipeDiv.append("<BR>");
					recipeDiv.append("<BR>");

					recipeDiv.append(" SOURCE: " + instructSource);
					recipeDiv.append("<BR>");
					recipeDiv.append("<BR>");
					recipeDiv.append(s);
					recipeDiv.append("<BR>");

	//
					recipeDiv.append(b);
					recipeDiv.append("<BR>");
					recipeDiv.append(retrieving);

	//

					$(".results").append(recipeDiv);
					$(".results").append("<BR>");				

}

function ajaxCall(queryURL){

	//getURL();

	$.ajax({url: queryURL, method: "GET"})

	.done(function(response){

		var results =  response.hits;
		var maxCount = 0
			console.log("RESULTS:");
			console.log(results);
			console.log(results.length);

			// clear results div
			//$(".results").empty();

	// display results loop
	for (var i=0; i<results.length; i++) {

		if ((maxIngreds=="" || maxIngreds>results[i].recipe.ingredientLines.length) && maxCount<100) {

			//(function() {
					maxCount++
					var recipeTitle = results[i].recipe.label;
					var recipeImageURL = results[i].recipe.image;
					var recipeIngreds = results[i].recipe.ingredientLines;
					var instructSource = results[i].recipe.source;
					var ingredsLink = results[i].recipe.shareAs;
					var instructionsLink = results[i].recipe.url;
					var servings = parseInt(results[i].recipe.yield);
					var calories = parseInt((results[i].recipe.calories)/servings);
					var recipeVotes = 0;

					//var voteCount;
					//var voteRetrieve;
					var resultName = results[i].recipe.label;
					var recipeName = results[i].recipe.label;
					var rICount = recipeIngreds.length + 1;
			

				DOMchange(recipeImageURL, recipeName, recipeVotes, maxCount, recipeTitle, recipeIngreds, instructSource, instructionsLink, calories, rICount, i);
			
			//})();//function

		} //maxIng 
			
	}//for loop

	$("#searchCrit").prepend("RESULTS RETURNED: " + results.length + "<BR>" + "<BR>");

	});//.done call
	.fail(function(){

		$(".results").html("<h1>We are experiencing some technical issues right now. Please try again later.</h1>");

	})//.fail
}

function showDiv(){
	 $('html, body').animate({
        	scrollTop: $("#BBB").offset().top
      }, 2000);

}

$(document).on("click","#submit", function (event){

	event.preventDefault();

	showDiv();
		
		$(".results").empty();

	// grab data
		meats = $("#meat").val().trim();
		cuisines = $("#cuisine").val().trim();
		diets = $("#diet").val().trim();
		allergies = $("#allergy").val().trim();
		calMin = $("#calMin").val().trim();
		calMax = $("#calMax").val().trim();
		maxIngreds = $("#ingreds").val().trim();

		displaySearch();
		//ajaxCall();
		getURL();

		//$("#searchCrit").prepend("RESULTS RETURNED: " + results.length + "<BR>" + "<BR>");
		

	
	return false;

});

$(document).on("click",".voteButton", function(){
		event.preventDefault();
						 	var resultName = $(this).val().trim();
						  	var pID = $(this).attr("data");
						  	
						  	var voteCount;
						  	
						  	/*database.ref().once('value').then(function(snapshot) {
				 			
				  			voteCount = (snapshot.child(resultName).exists() ? snapshot.child(resultName).val().votes : 0);
				  			
				  			});*/
						  					
						  	console.log(resultName);
							
						

				  			database.ref().once('value').then(function(snapshot) {
				 			
				 			
				  			voteCount = (snapshot.child(resultName).exists() ? snapshot.child(resultName).val().votes : 0);
				  			voteCount++

				  						console.log(voteCount);
						  	
						 			database.ref(resultName).update({
						  				votes : voteCount
						  			});

						  		
									   	console.log(resultName);
									   	console.log(snapshot.child(resultName).exists());
									   	console.log(snapshot.child(resultName).val())
								
								$("#" + pID).html("Recommended by: " + voteCount);
								//recipeDiv.append("Recommendations: "+ voteRetrieve);

				 	 		});

	return false;

});

});//ready

