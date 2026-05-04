// This function is called automatically by the Google Maps script in map.html
function initMap() {
    // 1. THE ACTUAL CENTER (Smack in the middle of BUP, Cozyne Co, and 29ers)
    const bupCenter = { lat: 13.2955, lng: 123.4848 };

    // 2. THE STRICT BOUNDING BOX (Locks the camera exactly to the campus area)
    const campusBounds = {
        north: 13.2985, // Top limit
        south: 13.2925, // Bottom limit
        west: 123.4820, // Left limit
        east: 123.4880  // Right limit
    };

    // 3. Initialize the Map
    const map = new google.maps.Map(document.getElementById("map"), {
        center: bupCenter,
        zoom: 17.5, 
        minZoom: 16.5, 
        maxZoom: 20, 
        mapTypeId: 'roadmap',
        
        // --- NEW CONTROLS ADDED HERE ---
        disableDefaultUI: false, // We need this false to show specific controls
        
        zoomControl: true, // Zoom in/out buttons
        
        // Adds the Satellite / Map toggle
        mapTypeControl: true, 
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU, // Makes it a clean dropdown instead of taking up space
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        
        // Adds the little yellow Pegman for Street View
        streetViewControl: true, 
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        
        // Adds a button to make the map full screen
        fullscreenControl: true, 
        
        // This locks the camera to your exact image bounds
        restriction: {
            latLngBounds: campusBounds,
            strictBounds: false 
        }
    });
}