// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAI6FT3WrhdqXUjwkaW-d2osyPasRYlScQ",
    authDomain: "in-or-out-8b800.firebaseapp.com",
    databaseURL: "https://in-or-out-8b800.firebaseio.com",
    storageBucket: "in-or-out-8b800.appspot.com",
    messagingSenderId: "141868409337"
  };
  
  firebase.initializeApp(config);

//firebase reference
var database = firebase.database();

// begin console log
console.log("Recipes 'In' Testing")

// Ready wrap the whole code
$(document).ready(function(){

	//initialized firebase to retrieve data
		database.ref().on('value', function(snapshot) {
			console.log(snapshot.val());

	});


	// set global variables
	var appKey="7b5ada340cf0a8e379450f9e20d0a560"
	var appID="a81083ad"
	var URL="https://cors-anywhere.herokuapp.com/https://api.edamam.com/search?"
	var meats = "";
	var cuisines = "";
	var diets = "";
	var allergies = "";
	var calMins = "";
	var calMaxs = "";
	var ingredss = "";
	var resultsCount = 0;

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
			$("#searchCrit").prepend("YOU MUST INPUT EITHER A MEAT OR CUISINE SELECTION" + "<BR>" + "<BR>" + "PLEASE TRY AGAIN!" + "<BR>" + "<BR>");
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

		//call the ajax function
		ajaxCall(queryURL);

};

//using this function to dynamically display in html element in the browser
function DOMchange(recipeImageURL, recipeName, recipeVotes, maxCount, recipeTitle, recipeIngreds, instructSource, instructionsLink, calories, rICount, i){

	//container div of each recipe
	var recipeDiv = $("<div>");
					recipeDiv.attr("class", "panel panel-primary");
					recipeDiv.attr("style", "width: 330px; float: left; margin-right:30px; padding-left:5px; padding-right:5px; padding-bottom:10px; border-color:transparent; text-align:center;");

	//create the image tag and set the attribute url, css style and add the class 
	var recipeImg = $("<img>");
					recipeImg.attr("src", recipeImageURL);
					recipeImg.attr("style", " position:relative; margin:15px auto;");
					recipeImg.attr("class", "pics");
	var attrImg = $("<img>");
					attrImg.attr("src", "assets/images/edamam.png");
					attrImg.attr("style", "position: relative; margin: 0 auto;"); //"float: right; margin-right:10px;");

	//create the button and set the value to the recipe name, add class, add css style
	var b = $("<button>").text("Recommend");
					b.val(recipeName);
					b.attr("style", "display: block; margin: 0 auto 0 auto; color: white; padding:10px; border-color:black; background-color:black;");
					b.attr("type", "button");
					b.addClass("voteButton");
					//set the unique data attribute to each button
					b.attr("data", [i]);
					console.log("Recipe Name Before: " + recipeName);



	//function databseRetrieve to retrieve the votes of each recipe
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

	//create the p tag to contain the retreived vote fromt the database
	var retrieving = $("<p>").html("Recommended By: "+ recipeVotes);
					//set the unique id to each paragraph to match the data attr of the button
					retrieving.attr("id", [i]);
					//add class
					retrieving.addClass("voteShow");

	// create the p tag to contain the recipe title, all so se its css style attribute
	var p = $("<p>").text("DISH #" + maxCount + ": " + recipeTitle);
					p.attr("style", "font-weight: 600; width: 330px;float: left; display: block; margin-left:-6px; margin-top:-1px;");
					p.attr("class", "panel-heading");

	// create the p tag to contain the number of ingredient
	var q = $("<p>").text(recipeIngreds);
	
	//create the button that contain the link to teh recipe page
	var s = $("<button>").text("Instructions").addClass("instructions");
					s.attr("onclick", "location.href="+"'"+instructionsLink+"';")
					s.attr("type", "button");
					s.attr("style", "display: block; margin: 0 auto 0 auto; color:white; padding:10px; border-color:black; background-color:black");

			//populate HTML
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
					recipeDiv.append(b);
					recipeDiv.append("<BR>");
					recipeDiv.append(retrieving);
					recipeDiv.append("<BR>");
					recipeDiv.append(attrImg);
					resultsCount++;
					$(".results").append(recipeDiv);
					$(".results").append("<BR>");				

}

//to auto scroll to the results
function showDiv(){

	 $('html, body').animate({
        	scrollTop: $("#forScroll").offset().top
      }, 2000);

}

//make ajax call function
function ajaxCall(queryURL){

	//getURL();

	$.ajax({url: queryURL, method: "GET"})

	.done(function(response){

		//create the variable to refer to the json object
		var results =  response.hits;
		//create the variable for the number of recipe create
		var maxCount = 0
			console.log("RESULTS:");
			console.log(results);
			console.log(results.length);

		if (results.length == 0) {
			console.log("Invalid Search");
			$("#searchCrit").prepend("INVALID SEARCH PARAMETERS!" + "<BR>" + "<BR>" + "PLEASE TRY AGAIN!" + "<BR>" + "<BR>");
			return false;
		}

	// display results loop
	for (var i=0; i<results.length; i++) {

		if ((maxIngreds=="" || maxIngreds > results[i].recipe.ingredientLines.length) && maxCount<100) {

					//local vairable
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
					var resultName = results[i].recipe.label;
					var recipeName = results[i].recipe.label;
					var rICount = recipeIngreds.length + 1;
			
				//call the function to change HTML element, also pass in the local variables from the ajax function
				DOMchange(recipeImageURL, recipeName, recipeVotes, maxCount, recipeTitle, recipeIngreds, instructSource, instructionsLink, calories, rICount, i);

		} //maxIngredient 
			
	}//for loop

	$("#searchCrit").prepend("RESULTS RETURNED: " + resultsCount + "<BR>" + "<BR>");

	//auto scroll to result
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
		meats = $("#meat").val().trim();
		cuisines = $("#cuisine").val().trim();
		diets = $("#diet").val().trim();
		allergies = $("#allergy").val().trim();
		calMin = $("#calMin").val().trim();
		calMax = $("#calMax").val().trim();
		maxIngreds = $("#ingreds").val().trim();
		resultsCount = 0;

		//call this function to show search criteria in the browser
		displaySearch();
		//ajaxCall();
		getURL();		

	return false;

});

$(document).on("click",".voteButton", function(){
		
		//prevent refresh
		event.preventDefault();
				
				//set a local vairable to store the recipe name which is the value form the button
				var resultName = $(this).val().trim();
				//set the local variable to store the data attr of the button whic is the [i]
				var pID = $(this).attr("data");
				//set local variable for voteCount		  	
				var voteCount;
						  					
					console.log(resultName);
							
						
				//acessing database once
				database.ref().once('value').then(function(snapshot) {
				 			
				 	//retrieve the value of the voteCount from the database		
				  	voteCount = (snapshot.child(resultName).exists() ? snapshot.child(resultName).val().votes : 0);
				  	//then increase the voteCount
				  	voteCount++

				  		console.log(voteCount);
					//store the new voteCount to the database	  	
					database.ref(resultName).update({
						votes : voteCount
					});

						  		
						console.log(resultName);
					   	console.log(snapshot.child(resultName).exists());
					   	console.log(snapshot.child(resultName).val())
					
					//display the voteCount in the browser ,, target the div using the id which is the same as pID variable			
					$("#" + pID).html("Recommended by: " + voteCount);

				 });

	return false;

});

});//ready

