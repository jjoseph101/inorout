// JAVASCRIPT FILE FOR RECIPE SEARCH aka "IN"

// ISSUES:  
// 1. Unable to find max ingredients API call...do we want to count ingredients of all returned results ourselves and just display those matching user's request?
// 2. Should we create checkboxes for some search criteria? [[YES]]
// 3. Should we create 'Instructions' button like on Edamam site? [[YES]]
// 4. Display any other criteria besides recipe name; image; calories; ingredients; instructions source; and instructions link?
// 5. Issue re not needing API key?  (e.g., appKey and appID)
// 6. Results look cluttered.  Should we display all info on results page? [[JUST PIC & NAME]]  [[ADD'L INFO ON NEXT PAGE]]
// 7. Line break after each ingredient? [DONE]
// 8. Fix issue re user not inputing all search fields [DONE]
// 9. Add diet labels? [[ON NEXT PAGE]]
// 10. Add health labels?[[ON NEXT PAGE]]

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

	// submit button event listener
	$("#submit").on("click", function (){

		// grab data
		meats = $("#meat").val().trim();
		cuisines = $("#cuisine").val().trim();
		diets = $("#diet").val().trim();
		allergies = $("#allergy").val().trim();
		calMin = $("#calMin").val().trim();
		calMax = $("#calMax").val().trim();
		maxIngreds = $("#ingreds").val().trim();

		// test
		console.log("Meat: " + meats);
		console.log("Cuisine: " + cuisines);
		console.log("Diet: " + diets);
		console.log("Allergy: " + allergies);
		console.log("Calories (min): " + calMin);
		console.log("Calories (max): " + calMax);
		console.log("Maximum Ingredients: " + maxIngreds);

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

		// check to make sure user inputs minimal search criteria
		if (meats=="" && cuisines=="") {
			$(".results").html("You must input either a meat selection or a cuisine selection" + "<BR>" + "Please try again");
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
		var queryURL = URL + "q=" + meatZ + cuisineZ + "&from=0&to=300" + dietZ + allergieZ + calMinZ + calMaxZ;
		console.log("queryURL: " + queryURL); 
	
		// ajax api call
		$.ajax({url: queryURL, method: "GET"}).done(function(response){
			var results =  response.hits;
			var maxCount = 0
			console.log("RESULTS:");
			console.log(results);
			console.log(results.length);

			// clear results div
			$(".results").empty();

			// display results loop
			for (var i=0; i<results.length; i++) {

				if ((maxIngreds=="" || maxIngreds>results[i].recipe.ingredientLines.length) && maxCount<100) {

					(function() {
					maxCount++
					// set local variables
					var recipeDiv = $("<div>");
					var recipeTitle = results[i].recipe.label;
					var recipeImg = $("<img>");
					var recipeImageURL = results[i].recipe.image;
					var recipeIngreds = results[i].recipe.ingredientLines;
					var instructSource = results[i].recipe.source;
					var ingredsLink = results[i].recipe.shareAs;
					var instructionsLink = results[i].recipe.url;
					var calories = parseInt(results[i].recipe.calories);
					var recipeVotes = 0;		
	//
					var voteCount;
					var voteRetrieve;
					var resultName = results[i].recipe.label;
					var recipeName = results[i].recipe.label;
					var b = $("<button>").text("Recommend This");
					b.val(recipeName);
					b.attr("style", "display: block; margin: 0 auto 0 auto; color: black;");
					b.attr("type", "button");
					b.addClass("voteButton");
					b.attr("data", [i]);
					console.log("Recipe Name Before: " + recipeName);

										
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

					var p = $("<p>").text("DISH #" + maxCount + ": " + recipeTitle);
					var q = $("<p>").text(recipeIngreds);
					var r = $("<p>").text(" SOURCE: " + instructSource);
					var s = $("<button>").text("Instructions");			

					// test local variables
					// console.log ("------------------------");
					// console.log("Item " + (i+1));
					// console.log(recipeTitle);
					// console.log(recipeImageURL);
					// console.log(recipeIngreds);
					// console.log(instructSource);
					// console.log(instructionsLink);

					//begin populating HTML page with results
					recipeImg.attr("src", recipeImageURL);
					recipeImg.attr("style", "margin:10px; position:relative;");
					recipeImg.attr("class", "pics");
					s.attr("onclick", "location.href="+"'"+instructionsLink+"';")
					s.attr("type", "button");
					s.attr("style", "display: block; margin: 0 auto 0 auto; color: black;");
					p.attr("style", "font-weight: bold; width: 330px; float: left; display: block; margin: 0 auto 0 auto; margin-left:-5px;");
					p.attr("class", "panel-heading");
					r.attr("style", "float: left; display: block; margin: 0 auto 0 auto;");
					var rICount = recipeIngreds.length+1;

					recipeDiv.attr("class", "panel panel-primary");
					recipeDiv.attr("style", "width: 330px; float: left; margin-right:30px; padding-left:5px; padding-bottom:5px;");
					recipeDiv.append(p);
					recipeDiv.append("<BR>");
					recipeDiv.append(recipeImg);
					recipeDiv.append("<BR>");
					recipeDiv.append(" CALORIES: " + calories);
					recipeDiv.append("<BR>");
					recipeDiv.append("<BR>");
					recipeDiv.append(" INGREDIENTS: " + rICount);
					recipeDiv.append("<BR>");
					recipeDiv.append("<BR>");

					//ingredient function
						// recipeDiv.append("INGREDIENTS:")
						// recipeDiv.append("<BR>");
						// for (var j=0; j<recipeIngreds.length; j++) {
						// 	recipeDiv.append(recipeIngreds[j]);
						// 	recipeDiv.append("<BR>");
						// };
						// recipeDiv.append("<BR>");

					recipeDiv.append(r);
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

						})();//function
					
				}; // if (max ing)

				
			}; //for loop result.lenght

			// display total number of recipes returned
			$("#searchCrit").prepend("RESULTS RETURNED: " + maxCount + "<BR>" + "<BR>");

		}); //ajax

		// prevent refresh
		return false;
	}); //submit

  $(document).on("click",".voteButton", function(){
		//event.preventDefault();
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
});//reday



