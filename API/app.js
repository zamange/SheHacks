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
        });
        // Removed catch block as requested



            // Fallback to dummy data
            const dummyData = {
                "totalPages": 45,
                "pageSize": 10,
                "totalItems": 449,
                "items": [
                    {"guid": "2", "name": "Standard Chartered Bank", "currencies": ["USD"], "countryCodes": ["ZW"], "logos": [], "productTypes": ["bank-top-up"]},
                    {"guid": "3", "name": "Stanbic Bank", "currencies": ["USD"], "countryCodes": ["ZW"], "logos": [], "productTypes": ["bank-top-up"]},
                    {"guid": "5", "name": "ZB Bank (Formerly Zimbank)", "currencies": ["USD"], "countryCodes": ["ZW"], "logos": [], "productTypes": ["bank-top-up","cash-collection"]},
                    {"guid": "6", "name": "Barclays Bank", "currencies": ["USD"], "countryCodes": ["ZW"], "logos": [], "productTypes": ["bank-top-up"]},
                    {"guid": "7", "name": "CABS", "currencies": ["RTG","USD"], "countryCodes": ["ZW"], "logos": [], "productTypes": ["bank-top-up","bill-payment","card-top-up","cash-collection"]},
                    {"guid": "8", "name": "Beverly Building Society", "currencies": ["USD"], "countryCodes": ["ZW"], "logos": [], "productTypes": ["bank-top-up"]},
                    {"guid": "9", "name": "CBZ", "currencies": ["USD","ZAR"], "countryCodes": ["ZW"], "logos": [], "productTypes": ["bank-top-up","cash-collection"]},
                    {"guid": "12", "name": "NMB (National Merchant Bank)", "currencies": ["USD"], "countryCodes": ["ZW"], "logos": [], "productTypes": ["bank-top-up"]},
                    {"guid": "14", "name": "Agribank", "currencies": ["USD"], "countryCodes": ["ZW"], "logos": [], "productTypes": ["bank-top-up"]},
                    {"guid": "16", "name": "FBC Bank", "currencies": ["USD"], "countryCodes": ["ZW"], "logos": [], "productTypes": ["bank-top-up"]}
                ]
            };
            displayResults(dummyData.items);
            addMarkersToMap(dummyData.items);
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
            <p><strong>GUID:</strong> ${location.guid}</p>
            <p>${location.address}</p>
            <p>${location.operating_hours}</p>
        `;
            // Add a click event listener to handle the click
            locationDiv.addEventListener('click', () => {
                alert(`You clicked on ${location.name} with GUID: ${location.guid}`);
                // Optionally, you can add more logic here to perform other actions
                // when the user clicks on a location, like fetching more details
                // or showing a modal with extended information.
            });
            resultsDiv.appendChild(locationDiv);
        });
    } else {
        resultsDiv.innerHTML = '<p>No payout locations found.</p>';
    }
}

function addMarkersToMap(locations) {
    if (locations.length > 0) {
        map.setCenter({ lat: -1.2921, lng: 36.8219 }); // Default location as Nairobi
        locations.forEach(location => {
            new google.maps.Marker({
                position: { lat: -1.2921, lng: 36.8219 }, // Default coordinates, update based on real data if available
                map: map,
                title: location.name
            });
        });
    }
}
