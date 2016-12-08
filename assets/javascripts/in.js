// JAVASCRIPT FILE FOR RECIPE SEARCH aka "IN"

// ISSUES:  
// 1. Unable to find max ingredients API call...do we want to count ingredients of all returned results ourselves and just display those matching user's request?
// 2. Should we create checkboxes for some search criteria?
// 3. Should we create 'Instructions' button like on Edamam site? [CREATED LINK]
// 4. Display any other criteria besides recipe name; image; ingredients; instructions source; and instructions link?
// 5. Issue re not needing API key?  (e.g., appKey and appID)
// 6. Results look cluttered.  Should we display all info on results page?
// 7. Line break after each ingredient? [DONE]
// 8. Fix issue re user not inputing all search fields [DONE]
// 9. Add diet labels?
// 10. Add health labels?

// begin console log
console.log("Recipes 'In' Testing")

// begin javascript code
$(document).ready(function(){

	// set global variables
	var appKey="7b5ada340cf0a8e379450f9e20d0a560"
	var appID="a81083ad"
	var URL="https://api.edamam.com/search?"
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

		// test
		console.log("Meat: " + meats);
		console.log("Cuisine: " + cuisines);
		console.log("Diet: " + diets);
		console.log("Allergy: " + allergies);
		console.log("Calories (min): " + calMin);
		console.log("Calories (max): " + calMax);

		// display search criteria on HTML page
		$("#searchCrit").empty();
		$("#searchCrit").append("SEARCH CRITERIA" + "<BR>");
		$("#searchCrit").append("Meat: " + meats + "<BR>");
		$("#searchCrit").append("Cuisine: " + cuisines + "<BR>");
		$("#searchCrit").append("Diet: " + diets + "<BR>");
		$("#searchCrit").append("Allergy: " + allergies + "<BR>");
		$("#searchCrit").append("Calories (min): " + calMin + "<BR>");
		$("#searchCrit").append("Calories (max): " + calMax + "<BR>");

		//check to make sure user inputs minimal search criteria
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
		//var queryURLOld = URL + "q=" + meats + "," + cuisines + "&from=0&to=100" + "&diet=" + diets + "&health=" + allergies + "&calories=gte%20" + calMin + ",%20lte%20" + calMax;
		var queryURL = URL + "q=" + meatZ + cuisineZ + "&from=0&to=100" + dietZ + allergieZ + calMinZ + calMaxZ;
		//console.log("queryURLOLD: " + queryURLOld); 
		console.log("queryURL: " + queryURL); 
	
		// ajax api call
		$.ajax({url: queryURL, method: "GET"}).done(function(response){
			var results =  response.hits;
			console.log("RESULTS:");
			console.log(results);
			console.log(results.length);

			// display total number of recipes returned
			$("#searchCrit").prepend("RESULTS RETURNED: " + results.length + "<BR>" + "<BR>");

			// clear results div
			$(".results").empty();

			// display results loop
			for (var i=0; i<results.length; i++) {

				// set local variables
				var recipeDiv = $("<div>");
				var recipeTitle = results[i].recipe.label;
				var recipeImg = $("<img>");
				var recipeImageURL = results[i].recipe.image;
				var recipeIngreds = results[i].recipe.ingredientLines;
				var instructSource = results[i].recipe.source;
				var instructionsLink = results[i].recipe.shareAs;
				var calories = parseInt(results[i].recipe.calories);
				var p = $("<p>").text("DISH #" + (i+1) + ": " + recipeTitle);
				var q = $("<p>").text(recipeIngreds);
				var r = $("<p>").text("SOURCE: " + instructSource);
				var s = $("<a>").text("Click HERE for Cooking Instructions");

				// test local variables
				console.log ("------------------------");
				console.log("Item " + (i+1));
				console.log(recipeTitle);
				console.log(recipeImageURL);
				console.log(recipeIngreds);
				console.log(instructSource);
				console.log(instructionsLink);

				//begin populating HTML page with results
				recipeImg.attr("src", recipeImageURL);
				recipeImg.attr("style", "float:left; margin:10px; position:relative;");
				recipeImg.attr("class", "pics");
				s.attr("href", instructionsLink);
				p.attr("style", "font-weight: bold; clear:both;");
				p.attr("class", "panel-heading");
				r.attr("style", "float: left;");
				recipeDiv.attr("class", "panel panel-primary");
				// recipeDiv.attr("style", "min-height: 300px;");
				recipeDiv.append(p);
				recipeDiv.append("<BR>");
				recipeDiv.append(recipeImg);
				recipeDiv.append("CALORIES: " + calories)
				recipeDiv.append("<BR>");
				recipeDiv.append("<BR>");
				recipeDiv.append("INGREDIENTS:")
				recipeDiv.append("<BR>");
				for (var j=0; j<recipeIngreds.length; j++) {
					recipeDiv.append(recipeIngreds[j]);
					recipeDiv.append("<BR>");
				};
				recipeDiv.append("<BR>");
				recipeDiv.append(r);
				recipeDiv.append("<BR>");
				recipeDiv.append(s);
				recipeDiv.append("<BR>");
				$(".results").append(recipeDiv);
				$(".results").append("<BR>");
			};
		});

		// prevent refresh
		return false;

	});
});



