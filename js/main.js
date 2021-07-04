//document.cookie = "promo_shown=1; Max-Age=2600000; SameSite=None; Secure"
require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer"

], function (esriConfig, Map, MapView, FeatureLayer) {

  esriConfig.apiKey = "AAPK4a51d51457ca47989323c81844ad3f32dID99_JGrxrl1acdATUne0knPXdE79jfqrYCVYUzQ_eevAeai9VKIaZpx15lNhkE";

  const map = new Map({
    basemap: "arcgis-dark-gray" // Basemap layer service
  });

  const view = new MapView({
    map: map,
    center: [-95.7129, 37.0902], // Longitude, latitude of the central point for the United States
    zoom: 3, // Zoom level
    container: "viewDiv" // Div element
  });

  const layer = new FeatureLayer({
    url: "https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/covid19_vaccine_time_series_us_state/FeatureServer/0"
  });

  map.add(layer);

});