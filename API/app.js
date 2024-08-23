let map;
let markers = [];

// Initialize Google Maps
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: -1.2921, lng: 36.8219 } // Default center (Nairobi, Kenya)
    });

    // Example dummy data for partner locations
    const partnerLocations = [
        { name: "Standard Chartered Bank", address: "123 Nairobi Ave, Nairobi, Kenya", position: { lat: -1.2833, lng: 36.8167 } },
        { name: "Stanbic Bank", address: "456 Nairobi St, Nairobi, Kenya", position: { lat: -1.2864, lng: 36.8172 } },
        { name: "ZB Bank (Formerly Zimbank)", address: "789 Market Rd, Nairobi, Kenya", position: { lat: -1.2921, lng: 36.8219 } },
        { name: "Barclays Bank", address: "101 City Plaza, Nairobi, Kenya", position: { lat: -1.2922, lng: 36.8228 } },
        { name: "CABS", address: "202 Business Park, Nairobi, Kenya", position: { lat: -1.2950, lng: 36.8230 } },
        { name: "Beverly Building Society", address: "303 Retail Center, Nairobi, Kenya", position: { lat: -1.2960, lng: 36.8240 } },
        { name: "CBZ", address: "404 Financial District, Nairobi, Kenya", position: { lat: -1.2970, lng: 36.8250 } },
        { name: "NMB (National Merchant Bank)", address: "505 Commerce Rd, Nairobi, Kenya", position: { lat: -1.2980, lng: 36.8260 } },
        { name: "Agribank", address: "606 Bank Street, Nairobi, Kenya", position: { lat: -1.2990, lng: 36.8270 } },
        { name: "FBC Bank", address: "707 Investment Blvd, Nairobi, Kenya", position: { lat: -1.3000, lng: 36.8280 } }
    ];

    // Add markers for the dummy locations
    partnerLocations.forEach((partner) => {
        const marker = new google.maps.Marker({
            position: partner.position,
            map: map,
            title: partner.name
        });
        markers.push(marker);
    });

    document.getElementById('search-button').addEventListener('click', function () {
        const query = document.getElementById('search-bar').value.trim().toLowerCase();
        const matchedPartner = partnerLocations.find(partner =>
            partner.name.toLowerCase().includes(query)
        );

        if (matchedPartner) {
            // Center the map to the matched partner location
            map.setCenter(matchedPartner.position);
            map.setZoom(14); // Zoom in for a closer view

            // Optionally, you can display additional information about the matched partner
            document.getElementById('results').innerHTML = `<p>Found: ${matchedPartner.name} - Lat: ${matchedPartner.position.lat}, Lng: ${matchedPartner.position.lng}</p>`;
        } else {
            // No match found, show dummy locations and alert
            alert('No exact match found. Displaying nearby partner locations instead.');
            document.getElementById('results').innerHTML = partnerLocations.map(partner =>
                `<p>${partner.name} - Lat: ${partner.position.lat}, Lng: ${partner.position.lng}</p>`
            ).join('');

            // Optionally, recenter and zoom out to show all locations
            const bounds = new google.maps.LatLngBounds();
            partnerLocations.forEach(partner => {
                bounds.extend(partner.position);
            });
            map.fitBounds(bounds);
        }
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

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
    window.open(googleMapsUrl, '_blank');
});
