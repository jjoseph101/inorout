# APIs Wrapper
In order to use the Yelp Search API wrapper:

1. Edit the index.js file with your own Yelp credentials
2. Push this to your Heroku app
3. You should then be able to navigate to [Your Heroku Domain]/yelp/search?[parameters] (e.g. myherokudomain.com/yelp/search?term=restaurants&limit=1&location=Houston)
4. The [parameters] accept all of Yelp's Search AP parameters (e.g. term, location, etc)
5. You should then be able to make an AJAX call from your front-end to the API
