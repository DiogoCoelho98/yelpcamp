const markerImgUrl = '/images/pin5.png';

const goodCampground = JSON.parse(campground);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v12',
  center: goodCampground.geometry.coordinates,
  zoom: 12
});

const el = document.createElement('div');
el.className = 'pin5';
el.style.backgroundImage = `url(${markerImgUrl})`;

new mapboxgl.Marker(el)
  .setLngLat(goodCampground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<h5 class="map-title">${goodCampground.title}</h5><p class="map-location">${goodCampground.location}</p>`)
  )
  .addTo(map);
