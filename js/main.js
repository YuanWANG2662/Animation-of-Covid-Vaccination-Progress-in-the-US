require([
  // import esri modules
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend",
  "esri/widgets/Home",
  "esri/widgets/Zoom",
  "esri/widgets/ScaleBar",
  "esri/widgets/Expand",
  "esri/widgets/Search",
  "esri/widgets/Search/LayerSearchSource",
  "esri/widgets/TimeSlider",
  "esri/core/watchUtils",
  //import custom modules
  "./js/modules/renderer.js",
  "./js/modules/search.js",
], function (
  // esri modules
  esriConfig,
  Map,
  MapView,
  FeatureLayer,
  Legend,
  Home,
  Zoom,
  ScaleBar,
  Expand,
  Search,
  LayerSearchSource,
  TimeSlider,
  watchUtils,
  //custom modules
  renderer,
  search,
) {

  // configure the ArcGIS API key
  esriConfig.apiKey = "AAPK4a51d51457ca47989323c81844ad3f32dID99_JGrxrl1acdATUne0knPXdE79jfqrYCVYUzQ_eevAeai9VKIaZpx15lNhkE";

  //create a map
  const map = new Map({
    basemap: "arcgis-dark-gray" // basemap layer service: dark grey canvas
  });

  //create a map view
  const view = new MapView({
    map: map,
    center: [-110, 35], // longitude, latitude for the United States (95.7129 W, 37.0902 N)
    zoom: 3, // zoom level
    container: "viewDiv" // viewDiv element
  });

  //get rendererType
  const rendererSelect = document.getElementById("renderer-select");

  //create a new layer
  const vaccineLayer = new FeatureLayer({
    title: "Covid-19 Daily Vaccination in the US",
    url: "https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/covid19_vaccine_time_series_us_state/FeatureServer/0",
    copyright: "App and maps by <a href=\"https://github.com/YuanWANG2662\">Yuan Wang</a>",
    outFields: ["*"],
    renderer: renderer.createRenderer(rendererSelect.value) // imported from the 'renderer' module
  });

  // add the layer to the map
  map.add(vaccineLayer);

  //create the legend
  new Legend({
    view,
    container: "legend" // add it to the 'legend' element
  });

  // clear the default ui widgets in the top left corner
  view.ui.empty("top-left");

  // adds the home widget to the top right corner of the MapView
  view.ui.add(new Home({
    view: view
  }), "top-right");

  // adds the zoom widget to the top right corner of the MapView
  view.ui.add(new Zoom({
    view: view
  }), "top-right");

  // Add scale bar to the bottom right corner of the view
  view.ui.add(new ScaleBar({
    view: view,
    unit: "metric"
  }), {
    position: "bottom-right"
  });

  //add the search button
  view.ui.add(new Expand({
    view,
    content: search.searchState(view, vaccineLayer) // imported from the 'search' module
  }), "top-right");

  // add the ui controls as an expandable icon
  view.ui.add(new Expand({
    view,
    content: document.getElementById("ui-controls"),
    expandIconClass: "esri-icon-menu",
    expanded: true
  }), "top-left");


  //add the time-slider-toggle and the timeSlider
  view.ui.add("time-slider-toggle", "bottom-left");
  view.ui.add("timeSliderDiv", "bottom-left");

  //configure the expandable time slider toggle button
  const timeVisibilityBtn = document.getElementById("time-slider-toggle");
  const timeSliderDiv = document.getElementById("timeSliderDiv");

  //when click on the time slider toggle button, the timeSlider switch visibility
  timeVisibilityBtn.addEventListener("click", toggleTimeOptionsVisibility);
  function toggleTimeOptionsVisibility() {
    //switch visibility of the timeSlider
    timeSliderDiv.style.visibility = (timeSliderDiv.style.visibility === "hidden") ? "visible" : "hidden";
    //switch icon style at the same time
    if (timeVisibilityBtn.classList.contains("esri-icon-time-clock")) {
      timeVisibilityBtn.classList.replace("esri-icon-time-clock", "esri-icon-expand");
    } else {
      timeVisibilityBtn.classList.replace("esri-icon-expand", "esri-icon-time-clock");
    }
  }

  // set initial time extent
  const initialTimeExtent = {
    start: new Date(2020, 11, 14),  // 2020.12.14 new Date(year, monthIndex, day)
    end: new Date(2021, 6, 3)       //  2021.7.3  new Date(year, monthIndex, day)
  }
  // configure timeSlider 
  const timeSlider = new TimeSlider({
    container: "timeSliderDiv",
    playRate: 100,
    loop: true,
    viewModel: {
      view: view,
      mode: "instant", //instant time value instead of time window
      fullTimeExtent: initialTimeExtent,
      timeExtent: {
        start: initialTimeExtent.end,
        end: initialTimeExtent.end
      },
    },
    stops: {
      interval: {
        value: 1,
        unit: "days"
      }
    }
  });

  // When the user changes the value of the time slider, change the renderer to reflect
  // data corresponding to the date indicated on the slider

  timeSlider.watch("values", () => {
    // representing selected date on the slider
    const activeDate = timeSlider.values[0];
    // update renderer to reference field
    renderer.updateRenderer(vaccineLayer, activeDate);
  });

  //update the map view when the user changes the value of the time slider
  view
    .whenLayerView(vaccineLayer)
    .then(function (layerView) {
      watchUtils.whenFalseOnce(layerView, "updating", function () {
        const activeDate = timeSlider.values[0];
        renderer.updateRenderer(vaccineLayer, activeDate);
      });
    });

  rendererSelect.addEventListener("change", () => {
    updateLayer(false);
  });





});