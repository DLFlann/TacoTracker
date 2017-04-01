// Create variable for map, map markers, and marker info window
var map;
var markers = [];
var infowindow;

// Store FourSquare API URL, API version, and Mode
var foursquareApiUrl = 'https://api.foursquare.com/v2/venues/';
var foursquareVersion = '20170401';
var foursquareMode = 'foursquare';

// Store FourSquare App Id
var foursquareAppId = 'TB5PK10PDKPFXKDCVY0ZF3VBTG5FAY341GM1ZCPJKIDAWGUX';

// Store FourSquare App Secret
var foursquareSecret = '2TH1RSWXM0HQMXIMAGRPQYKAV1LLUTUAFXV2BEL5ZMX0XEEI';

function initMap() {
    // Constructor creates a new map centered on Austin, TX, with map controls and
    // full screen turned off
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 30.267153, lng: -97.743061},
        zoom: 13,
        gestureHandling: 'greedy',
        mapTypeControl: false,
        fullscreenControl: false
    });
    // Create marker for taco restaurants.
    createMarkersForPlaces();
}

// Function called if Google Maps API fails to load, displays an al
function googleFail() {
    alert('Google Maps Failed to Load');
}

// Create markers for each restaurant in the restaurants object
function createMarkersForPlaces() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < restaurants.length; i++) {
        var restaurant = restaurants[i];
        // Set a marker for each location
        var marker = new google.maps.Marker({
            map: map,
            title: restaurant.name,
            position: restaurant.location,
            googleId: restaurant.googleId,
            foursquareId: restaurant.foursquareId,
            animation: google.maps.Animation.DROP
        });
        // Create an infowindow object
        infowindow = new google.maps.InfoWindow();
        // Add an event listender to the marker to open the infowindow and animate marker
        marker.addListener('click', function() {
            if (infowindow.marker === this) {
                console.log('This infowindow is already on this marker');
            } else {
                this.setAnimation(google.maps.Animation.BOUNCE);
                getPlaceDetails(this, infowindow);
            }
        });
        // Add this marker to the markers array
        markers.push(marker);
        // Extends the bounds of the map to fit the marker
        bounds.extend(restaurant.location);

    }
    // Set the bounds of the map to fit all markers created
    map.fitBounds(bounds);
}

// Function to run FourSquare # of Likes Ajax Request
function foursquareLikes (foursquareId) {
        $.ajax({
        url: foursquareApiUrl+foursquareId+'/likes',
        data: {
            "client_id": foursquareAppId,
            "client_secret": foursquareSecret,
            "v": foursquareVersion,
            "m": foursquareMode
        }
    }).done(function(object) {
        // Append the number of FourSquare likes to the "likes" div in the infowindow
        $('.likes').append('<strong>' + object.response.likes.summary + '</strong>');
    }).fail(function() {
        // Error case informs user that we are unable to get the number of likes if request fails
        $('.likes').append('<strong>Sorry, we couldn\'t get the number of likes for this restaurant.</strong>');
    });
}

// Function to run FourSquare Photos Ajax Request
function foursquarePhotos (foursquareId) {
        $.ajax({
        url: foursquareApiUrl+foursquareId+'/photos',
        data: {
            "limit": 3,
            "client_id": foursquareAppId,
            "client_secret": foursquareSecret,
            "v": foursquareVersion,
            "m": foursquareMode
        }
    }).done(function(object) {
        // Loop through images returned and append each to the infowindow
        var imgUrl;
        for (var i = 0; i < object.response.photos.items.length; i++) {
            imgUrl  = object.response.photos.items[i].prefix + 'height100' + object.response.photos.items[i].suffix;
            $('.infoimages').append('<img src="' + imgUrl + '" style="display: inline;">');
        }
    }).fail(function() {
        // Error case informs user that we are unable to display images if request fails
        $('.infoimages').append('<strong>We couldn\'t load the images for this restaurant.</strong>');

    });
}


// Function to run FourSquare Tips Ajax Request
function foursquareTips (foursquareId) {
        $.ajax({
        url: foursquareApiUrl+foursquareId+'/tips',
        data: {
            "client_id": foursquareAppId,
            "client_secret": foursquareSecret,
            "v": foursquareVersion,
            "m": foursquareMode
        }
    }).done(function(object) {
        // Loop through the user tips returned and append each to the infowindow
        for (var i = 0; i < 3; i++) {
            $('.tips').append('<p style="padding: 5px; border-top: 1px solid #777;">' +
                object.response.tips.items[i].text + '</p>');
        }
    }).fail(function() {
        // Error case informs user that we are unable to display tips if request fails
        $('.tips').append('<strong>Sorry, we couldn\'t get the tips and advice for this restaurant.</strong>');
    });
}


// Function to retrieve details about the selecte restaurant location
function getPlaceDetails(marker, infowindow) {
    var service = new google.maps.places.PlacesService(map);
    // Run Google place service request
    service.getDetails({
        placeId: marker.googleId
    }, function(place, status) {
        // If Google place service succeds, create content for infowindow
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Set marker property on this infowindow
            infowindow.marker = marker;
            // Set inner HTML to be shown in infowindow
            var innerHTML = '<div class="infowindow">';
            // Run FourSquare Ajax request for like, images, and user tips
            foursquareLikes(marker.foursquareId);
            foursquarePhotos(marker.foursquareId);
            foursquareTips(marker.foursquareId);

            if (place.name) {
            innerHTML += '<strong>' + place.name + '</strong>';
            }
            if (place.formatted_address) {
            innerHTML += '<br>' + place.formatted_address;
            }
            if (place.formatted_phone_number) {
            innerHTML += '<br>' + place.formatted_phone_number;
            }
            if (place.opening_hours) {
            innerHTML += '<br><br><strong>Hours:</strong><br>' +
                place.opening_hours.weekday_text[0] + '<br>' +
                place.opening_hours.weekday_text[1] + '<br>' +
                place.opening_hours.weekday_text[2] + '<br>' +
                place.opening_hours.weekday_text[3] + '<br>' +
                place.opening_hours.weekday_text[4] + '<br>' +
                place.opening_hours.weekday_text[5] + '<br>' +
                place.opening_hours.weekday_text[6];
            }
            innerHTML += '<br><br><br><img src="images/Powered-by-Foursquare.png">'
            innerHTML += '<div class="likes"></div>';
            innerHTML += '<br><div class="infoimages" style="width: 100%; height: 100px; overflow: auto; white-space: nowrap;"></div>';
            innerHTML += '<br><div class="tips"></div>';
            innerHTML += '</div>';
            infowindow.setContent(innerHTML);
            infowindow.open(map, marker);
            // Clear marker property if info window is closed.
            infowindow.addListener('closeclick', function() {
                marker.setAnimation(null);
                infowindow.marker = null;
            });
        }
    });
}
