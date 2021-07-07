//document.cookie = "promo_shown=1; Max-Age=2600000; SameSite=None; Secure"
require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/renderers/DotDensityRenderer",
  "esri/widgets/Legend",
  "esri/widgets/Expand"
], function (
  esriConfig,
  Map,
  MapView,
  FeatureLayer,
  DotDensityRenderer,
  Legend,
  Expand
) {
  // configure the ArcGIS API key
  esriConfig.apiKey = "AAPK4a51d51457ca47989323c81844ad3f32dID99_JGrxrl1acdATUne0knPXdE79jfqrYCVYUzQ_eevAeai9VKIaZpx15lNhkE";
  //create a amp
  const map = new Map({
    basemap: "arcgis-dark-gray" // Basemap layer service
  });
  //create a map view
  const view = new MapView({
    map: map,
    center: [-95.7129, 37.0902], // Longitude, latitude of the central point for the United States
    zoom: 3, // Zoom level
    container: "viewDiv" // Div element
  });

  //add the legend
  view.ui.add(
    [
      new Expand({
        view: view,
        content: new Legend({ view: view }),
        group: "top-left",
        expanded: true
      }),
      // new Expand({
      //   view: view,
      //   content: new Bookmarks({ view: view }),
      //   group: "top-left"
      // })
    ],
    "top-left"
  );

  //configure the dot density renderer
  const dotDensityRenderer = new DotDensityRenderer({
    dotValue: 150,
    outline: null,
    referenceScale: 577790, // 1:577,790 view scale
    legendOptions: {
      unit: "doses"
    },
    attributes: [
      {
        // One red dot will be drawn for every 100 White people
        field: "date_06_25_2021",
        color: "#32ef94",
        label: "Covid-19 Vacine Doses"
      },]
  })


  //create a new layer
  const layer = new FeatureLayer({
    title: "Covid19 Vaccine Time Series",
    url: "https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/covid19_vaccine_time_series_us_state/FeatureServer/0",
    copyright: "App and maps by <a href=\"https://github.com/YuanWANG2662\">Yuan Wang</a>",
    outFields: ["*"],
    renderer: dotDensityRenderer
  });

  map.add(layer);


});