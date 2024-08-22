// Initialize global map variable
let map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: -1.2921, lng: 36.8219 } // Default to Nairobi, Kenya
    });
}

document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-bar').value;
    if (query) {
        fetchLocations(query);
    } else {
        alert('Please enter a location or partner name.');
    }
});

function fetchLocations(query) {
    // Replace with your actual API endpoint
    const apiUrl = `https://api-ubt.mukuru.com/taurus/v1/resources/pay-out-partners?search=${encodeURIComponent(query)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. ${text}`);
                });
            }
            return response.json();
        })
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
            alert(`An error occurred while fetching locations: ${error.message}`);
        });
}

function displayResults(locations) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results
    if (locations.length > 0) {
        locations.forEach(location => {
            const locationDiv = document.createElement('div');
            locationDiv.className = 'result-item';
            locationDiv.innerHTML = `
                <h3>${location.partner_name}</h3>
                <p>${location.address}</p>
                <p>${location.operating_hours}</p>
            `;
            resultsDiv.appendChild(locationDiv);
        });
    } else {
        resultsDiv.innerHTML = '<p>No payout locations found.</p>';
    }
}

function addMarkersToMap(locations) {
    if (locations.length > 0) {
        map.setCenter({ lat: locations[0].latitude, lng: locations[0].longitude });
        locations.forEach(location => {
            new google.maps.Marker({
                position: { lat: location.latitude, lng: location.longitude },
                map: map,
                title: location.name
            });
        });
    }
}
