let map;
let markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: -1.2921, lng: 36.8219 } // Default center (Nairobi, Kenya)
    });
}

// Automatically prompt for location when the page loads
window.onload = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};

function showPosition(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    // Update the map center to the user's location
    map.setCenter({ lat: userLat, lng: userLng });

    // Display status
    document.getElementById('location-status').textContent = "Location detected. You will be redirected to the map.";
    document.getElementById('search-section').style.display = 'block';
}

function showError(error) {
    let errorMessage = "";
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = "An unknown error occurred.";
            break;
    }
    document.getElementById('location-status').textContent = errorMessage;
}

document.getElementById('search-button').addEventListener('click', function () {
    const query = document.getElementById('search-bar').value;
    if (query) {
        fetchLocations(query);
    } else {
        alert('Please enter a location or partner name.');
    }
});

function fetchLocations(query) {
    const apiUrl = `https://api-ubt.mukuru.com/taurus/v1/resources/pay-out-partners?search=${encodeURIComponent(query)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                displayResults(data.items);
                addMarkersToMap(data.items);
            } else {
                displayResults([]);
                alert('No payout locations found.');
            }
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
            alert('An error occurred while fetching locations. Displaying dummy data instead.');

            // Fallback to dummy data
            const dummyData = getDummyData();
            displayResults(dummyData.items);
            addMarkersToMap(dummyData.items);
        });
}

function getDummyData() {
    return {
        "items": [
            { "guid": "2", "name": "Standard Chartered Bank", "coordinates": { lat: -1.2833, lng: 36.8167 } },
            { "guid": "3", "name": "Stanbic Bank", "coordinates": { lat: -1.2864, lng: 36.8172 } },
            { "guid": "5", "name": "ZB Bank (Formerly Zimbank)", "coordinates": { lat: -1.2921, lng: 36.8219 } },
            { "guid": "6", "name": "Barclays Bank", "coordinates": { lat: -1.2922, lng: 36.8228 } },
            { "guid": "7", "name": "CABS", "coordinates": { lat: -1.2950, lng: 36.8230 } },
            { "guid": "8", "name": "Beverly Building Society", "coordinates": { lat: -1.2960, lng: 36.8240 } },
            { "guid": "9", "name": "CBZ", "coordinates": { lat: -1.2970, lng: 36.8250 } },
            { "guid": "12", "name": "NMB (National Merchant Bank)", "coordinates": { lat: -1.2980, lng: 36.8260 } },
            { "guid": "14", "name": "Agribank", "coordinates": { lat: -1.2990, lng: 36.8270 } },
            { "guid": "16", "name": "FBC Bank", "coordinates": { lat: -1.3000, lng: 36.8280 } }
        ]
    };
}

function displayResults(locations) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results
    if (locations.length > 0) {
        locations.forEach(location => {
            const locationDiv = document.createElement('div');
            locationDiv.className = 'result-item';
            locationDiv.innerHTML = `
                <h3>${location.name}</h3>
            `;
            resultsDiv.appendChild(locationDiv);
        });
    } else {
        resultsDiv.innerHTML = '<p>No payout locations found.</p>';
    }
}

function addMarkersToMap(locations) {
    // Clear previous markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    const bounds = new google.maps.LatLngBounds();

    locations.forEach(location => {
        const marker = new google.maps.Marker({
            position: location.coordinates,
            map: map,
            title: location.name
        });
        markers.push(marker);
        bounds.extend(marker.position);
    });

    // Adjust the map to fit all markers
    map.fitBounds(bounds);
}

// Redirect to Google Maps for specific searches
document.getElementById('search-location').addEventListener('click', function () {
    const destination = document.getElementById('destination').value;
    if (destination.trim() === "") {
        alert("Please enter a location.");
        return;
    }

    const searchQuery = encodeURIComponent(destination);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    window.open(mapsUrl, '_blank');
});

window.addEventListener('scroll', function() {
    const banner = document.querySelector('.banner');
    const bannerImage = banner.querySelector('img');
    const maxScroll = 300; // Increased scroll range for more exaggerated effect

    let scrollValue = window.scrollY;

    if (scrollValue > maxScroll) {
        scrollValue = maxScroll;
    }

    const newHeight = 400 - (scrollValue / maxScroll) * 300; // Exaggerate height reduction from 400px to 100px
    banner.style.height = `${newHeight}px`;

    // Add a scaling effect to the banner image
    const scaleValue = 1 - (scrollValue / maxScroll) * 0.5; // Scale from 1 to 0.5
    bannerImage.style.transform = `scale(${scaleValue})`;

    // Optional: Add a fading effect
    const opacityValue = 1 - (scrollValue / maxScroll) * 0.5; // Fade out as you scroll
    bannerImage.style.opacity = `${opacityValue}`;
});

document.getElementById('toggle-vision').addEventListener('click', function() {
    const body = document.body;
    const container = document.querySelector('.container');
    const icon = document.getElementById('vision-icon');

    body.classList.toggle('night-vision');
    container.classList.toggle('night-vision');

    if (body.classList.contains('night-vision')) {
        icon.src = 'night-icon.png'; // Change to night icon
        icon.alt = 'Night Vision';
    } else {
        icon.src = 'day-icon.png'; // Change to day icon
        icon.alt = 'Day Vision';
    }
});
