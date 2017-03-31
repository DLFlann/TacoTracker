
var map;

var markers = [];

var infowindow;

function initMap() {
    // Constructor creates a new map centered on Austin, TX, with map controls and
    // full screen turned off
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 30.267153, lng: -97.743061},
        zoom: 13,
        gestureHandling: "greedy",
        mapTypeControl: false,
        fullscreenControl: false
    });
    // Create marker for taco restaurants.
    createMarkersForPlaces();
}

function googleFail() {
    alert("Google Maps Failed to Load");
}

// Create markers for each taco place retrurned from place services search
function createMarkersForPlaces() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < restaurants.length; i++) {
        var restaurant = restaurants[i];
        // Create a marker for each place
        var marker = new google.maps.Marker({
            map: map,
            title: restaurant.name,
            position: restaurant.location,
            googleId: restaurant.googleId,
            foursquareId: restaurant.foursquareId,
            animation: google.maps.Animation.DROP
        });
        // Crate infowindow
        infowindow = new google.maps.InfoWindow();
        marker.addListener("click", function() {
            if (infowindow.marker === this) {
                console.log("This infowindow is already on this marker");
            } else {
                this.setAnimation(google.maps.Animation.BOUNCE);
                getPlaceDetails(this, infowindow);
            }
        });
        markers.push(marker);

        bounds.extend(restaurant.location);

    }
    map.fitBounds(bounds);
}

// Function to run FourSquare # of Likes Ajax Request
function foursquareLikes (foursquareId) {
        $.ajax({
        url: foursquareApiUrl+foursquareId+"/likes",
        data: {
            "client_id": foursquareAppId,
            "client_secret": foursquareSecret,
            "v": foursquareVersion,
            "m": foursquareMode
        }
    }).done(function(object) {
        console.log(object.response.likes.summary);
        $(".likes").append("<strong>" + object.response.likes.summary + "</strong>");
        // var infocon = infowindow.getContent();
        // infowindow.setContent(infocon + "<br><br><div><strong>" + object.response.likes.summary + "</strong></div>");
    }).fail(function() {
        alert("Sorry, we couldn't get the number of likes for this restaurant.");
    });
}

// Function to run FourSquare Photos Ajax Request
function foursquarePhotos (foursquareId) {
        $.ajax({
        url: foursquareApiUrl+foursquareId+"/photos",
        data: {
            "limit": 3,
            "client_id": foursquareAppId,
            "client_secret": foursquareSecret,
            "v": foursquareVersion,
            "m": foursquareMode
        }
    }).done(function(object) {
        var imgUrl;
        for (var i = 0; i < object.response.photos.items.length; i++) {
            imgUrl  = object.response.photos.items[i].prefix + "height100" + object.response.photos.items[i].suffix;
            $(".infoimages").append("<img src='" + imgUrl + "' style='display: inline;'>");
        }
    }).fail(function() {
        alert("Sorry, we couldn't get photos for this restaurant.");
    });
}


// Function to run FourSquare Tips Ajax Request
function foursquareTips (foursquareId) {
        $.ajax({
        url: foursquareApiUrl+foursquareId+"/tips",
        data: {
            "client_id": foursquareAppId,
            "client_secret": foursquareSecret,
            "v": foursquareVersion,
            "m": foursquareMode
        }
    }).done(function(object) {
        for (var i = 0; i < 3; i++) {
            $(".tips").append("<p style='padding: 5px; border-top: 1px solid #777;'>" + object.response.tips.items[i].text + "</p>");
        }
    }).fail(function() {
        alert("Sorry, we couldn't get the tips and advice for this restaurant.");
    });
}

function getPlaceDetails(marker, infowindow) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: marker.googleId
    }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Set marker property on this infowindow
            infowindow.marker = marker;
            // Set inner HTML to be shown in infowindow
            var innerHTML = "<div class='infowindow'>";
            foursquareLikes(marker.foursquareId);
            foursquarePhotos(marker.foursquareId);
            foursquareTips(marker.foursquareId);
            if (place.name) {
            innerHTML += "<strong>" + place.name + "</strong>";
            }
            if (place.formatted_address) {
            innerHTML += "<br>" + place.formatted_address;
            }
            if (place.formatted_phone_number) {
            innerHTML += "<br>" + place.formatted_phone_number;
            }
            if (place.opening_hours) {
            innerHTML += "<br><br><strong>Hours:</strong><br>" +
                place.opening_hours.weekday_text[0] + "<br>" +
                place.opening_hours.weekday_text[1] + "<br>" +
                place.opening_hours.weekday_text[2] + "<br>" +
                place.opening_hours.weekday_text[3] + "<br>" +
                place.opening_hours.weekday_text[4] + "<br>" +
                place.opening_hours.weekday_text[5] + "<br>" +
                place.opening_hours.weekday_text[6];
            }
            innerHTML += "<br><br><br><img src='images/Powered-by-Foursquare.png'>"
            innerHTML += "<div class='likes'></div>";
            innerHTML += "<br><div class='infoimages' style='width: 100%; height: 100px; overflow: auto; white-space: nowrap;'></div>";
            innerHTML += "<br><div class='tips'></div>";
            innerHTML += "</div>";
            infowindow.setContent(innerHTML);
            infowindow.open(map, marker);
            // Clear marker property if info window is closed.
            infowindow.addListener("closeclick", function() {
                marker.setAnimation(null);
                infowindow.marker = null;
            });
        }
    });
}
