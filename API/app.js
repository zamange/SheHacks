document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-bar').value;
    if (query) {
        fetchLocations(query);
    } else {
        alert('Please enter a location or partner name.');
    }
});
function fetchLocations(query) {
    // Replace the base URL with your actual API endpoint
    const apiUrl = `https://api-ubt.mukuru.com/taurus/v1/resources/pay-out-partners?search=${encodeURIComponent(query)}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayResults(data.locations);
            addMarkersToMap(data.locations);
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
            alert('An error occurred while fetching locations.');
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
function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: -1.2921, lng: 36.8219 } // Default to Nairobi, Kenya
    });
    // Add markers based on locations
    // locations.forEach(location => {
    //     const marker = new google.maps.Marker({
    //         position: { lat: location.latitude, lng: location.longitude },
    //         map: map,
    //         title: location.partner_name
    //     });
    // });

function addMarkersToMap(locations) {
    // Clear existing markers
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: locations[0].latitude, lng: locations[0].longitude } // Center the map on the first location
    });
    
    // Add a marker for each location
    locations.forEach(location => {
        const marker = new google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map: map,
            title: location.partner_name
        });
    });
}


    
}