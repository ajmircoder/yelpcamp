mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
   container: 'map',
   style: 'mapbox://styles/mapbox/streets-v12',
   center: campground.geometry.coordinates, 
   zoom: 9, 
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .addTo(map)