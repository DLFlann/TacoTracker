// Array of all restaurants as objects with name, location, Google id, and FourSquare id
var restaurants = [
        {name: "Taco Shack", location: {lat: 30.2661039,lng: -97.7423323}, googleId: "ChIJCbBGIgi1RIYRmwFxbb30Ky8", foursquareId: "45f29bb2f964a520e0431fe3"},
        {name: "Pueblo Viejo", location: {lat: 30.263133,lng: -97.72592879999999}, googleId: "ChIJ-8dq9a-1RIYR9P-7JI7MRI8", foursquareId: "4cb890cb7148f04dacf5d0ab"},
        {name: "Veracruz All Natural Food Truck", location: {lat: 30.2579332,lng: -97.7259275}, googleId: "ChIJ5TnXj7O1RIYR1QQH8J_paW8", foursquareId: "4d8d295fc1b1721e798b1246"},
        {name: "Tamale House East", location: {lat: 30.26151650000001,lng: -97.72436759999999}, googleId: "ChIJU0iB3ba1RIYRkKACYijJG00", foursquareId: "4f5cd4e6e4b008b15792ebac"},
        {name: "Torchy's Tacos", location: {lat: 30.250744,lng: -97.7542813}, googleId: "ChIJA4q4kuK0RIYRF48xE3QuXhs", foursquareId: "49be75ccf964a520ad541fe3"},
        {name: "Juan in a Million", location: {lat: 30.25535369999999,lng: -97.71906580000001}, googleId: "ChIJu94Vu8q1RIYRI36mVrMr-IY", foursquareId: "45fd161af964a52076441fe3"},
        {name: "Taco Joint", location: {lat: 30.29153860000001,lng: -97.73497160000001}, googleId: "ChIJ5dmFaIS1RIYRgb_KK7WtaA8", foursquareId: "4f257b12e4b006e5c3334cb5"},
        {name: "Torchy's Tacos", location: {lat: 30.293653,lng: -97.74171299999999}, googleId: "ChIJtXihV3-1RIYRlOwoggkOrTU", foursquareId: "49ee1ef0f964a52026681fe3"},
        {name: "Mi Madre's Restaurant", location: {lat: 30.2841367,lng: -97.71892799999999}, googleId: "ChIJ9Zeruey1RIYRkrfwh9Rb9Rk", foursquareId: "4a46566df964a520b4a81fe3"},
        {name: "Taco Mex", location: {lat: 30.2846468,lng: -97.71485799999999}, googleId: "ChIJZ4kuIuy1RIYRS0KldSxpuPQ", foursquareId: "4b805d56f964a520b86b30e3"},
        {name: "Marcelino Pan y Vino", location: {lat: 30.26257309999999,lng: -97.70359259999999}, googleId: "ChIJcaXcyta1RIYRxgtMkAGWLAU", foursquareId: "4b080983f964a520ba0223e3"},
        {name: "Torchy's Tacos", location: {lat: 30.23678779999999,lng: -97.7628277}, googleId: "ChIJg239z-m0RIYRp2mpN1qppiU", foursquareId: "49ee1e97f964a52025681fe3"},
        {name: "Taco Xpress", location: {lat: 30.24576620000001,lng: -97.7781976}, googleId: "ChIJ6SY7uda0RIYR__R0hhXj5YI", foursquareId: "43cddb83f964a520d42d1fe3"},
        {name: "Tacodeli", location: {lat: 30.258426,lng: -97.78760500000001}, googleId: "ChIJ61ASBtNKW4YRtAENDNyhPsU", foursquareId: "412bd680f964a520b50c1fe3"},
        {name: "Papalote", location: {lat: 30.2435326,lng: -97.78189789999999}, googleId: "ChIJy45PmdO0RIYREm1FXCAOeG0", foursquareId: "4c7baea1df08a1cd0117e15d"},
        {name: "Paco's Tacos", location: {lat: 30.3074261,lng: -97.705849}, googleId: "ChIJBd-COgTKRIYRalF7kGnZfNo", foursquareId: "4c8a26ab1797236a94cc5e88"},
        {name: "Porfirio's Tacos", location: {lat: 30.2553137,lng: -97.7305659}, googleId: "ChIJIRMfn7K1RIYR8SkNO_ohGEg", foursquareId: "4a295006f964a5207f951fe3"},
        {name: "Tacodeli", location: {lat: 30.31052799999999,lng: -97.740117}, googleId: "ChIJXQ-Uy2LKRIYR3SVdFPGjS-0", foursquareId: "4bb3d8d72397b713efb438b3"},
        {name: "OneTaco - an urban taqueria (container)", location: {lat: 30.269853,lng: -97.748172}, googleId: "ChIJZX0bHgy1RIYRKJA0XYFhY94", foursquareId: "4b9bbc99f964a520691f36e3"},
        {name: "Joe's", location: {lat: 30.2611771,lng: -97.71666039999999}, googleId: "ChIJFXwBcsm1RIYRcIIjFUjKD2g", foursquareId: "4a6346e4f964a520a9c41fe3"},
    ];

var ViewModel = function() {
    // Assign this to self variable for use unambiguous use
    var self = this;

    // Create an observable array for the restaurants locations model data
    self.locations = ko.observableArray();

    // Create a Knockout observable to track user input in search field
    self.locationsSearch = ko.observable('');

    // Function to copy restaurant data into loctions observable array
    function copyRestaurants() {
        for (var i = 0; i < restaurants.length; i++) {
            var restaurant = {
                name: restaurants[i].name,
                googleId: restaurants[i].googleId,
            };
            self.locations.push(restaurant);
        }
    }
    // Run previously defined function, copy restaurant data to observable array
    copyRestaurants();

    // Function opens locations list draw
    self.showList = function() {
        $('.restaurants-list-container').toggleClass('open');
    };

    // Function, finds marker for location and opens the info window at marker
    self.showInfo = function(location) {
        var marker;

        // Find marker with matching name, otherwise set animation to null to stop
        // any previously opened marker's animation
        for (var i = 0; i < markers.length; i++) {
            if (location.googleId === markers[i].googleId) {
                marker = markers[i];
            } else {
                markers[i].setAnimation(null);
            }
        }

        // Set infowindow on marker, set marker animation and get restaurant details
        if (infowindow.marker === marker) {
            console.log('This infowindow is already on this marker');
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            getPlaceDetails(marker, infowindow);
            self.showList();
        }
    };

    // Creates an observable to remove filtered markers when data is entered in search
    self.locationsSearch.subscribe(function(searchValue) {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].title.includes(searchValue) !== true) {
                markers[i].setMap(null);
            } else {
                markers[i].setMap(map);
            }
        }
    });
};

ko.applyBindings(new ViewModel());
