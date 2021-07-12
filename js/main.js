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
  "esri/widgets/TimeSlider",
  "esri/core/watchUtils",
  //import custom modules
  "./js/modules/renderer.js",
  "./js/modules/search.js",
  "./js/modules/popupUtils.js",
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
  TimeSlider,
  watchUtils,
  //custom modules
  renderer,
  search,
  popupUtils,
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
    container: "viewDiv", // viewDiv element
    popup: {
      dockEnabled: true,
      dockOptions: {
        // Ignore the default sizes that trigger responsive docking
        breakpoint: false,
        position: "bottom-right"
      }
    },
  });

  //get rendererType
  const rendererSelect = document.getElementById("renderer-select");

  //create a new layer
  const vaccineLayer = new FeatureLayer({
    title: "Covid-19 Total Vaccinations in the US",
    url: "https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/covid19_vaccine_time_series_us_state/FeatureServer/0",
    copyright: "App and maps by <a href=\"https://github.com/YuanWANG2662\">Yuan Wang</a>",
    outFields: ["*"],
    renderer: renderer.createRenderer(rendererSelect.value, 'date_07_03_2021'), // initialize renderer with the imported module 'renderer'
    popupTemplate: popupUtils.createPopupTemplate(rendererSelect.value, 'date_07_03_2021') // initialize popupTemplate with the imported module 'popupUtils'
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
        start: initialTimeExtent.end, //start equals end, since the instant mode is used
        end: initialTimeExtent.end //start equals end, since the instant mode is used
      },
    },
    stops: {
      interval: {
        value: 1,
        unit: "days"
      }
    }
  });

  // function to update the layer
  // to be revoked when the user change the value of the timeslider or the select box
  function updateLayer() {
    // representing selected date on the slider
    const activeDate = timeSlider.values[0];
    //construct the date field according to the way it's stored in the feature layer
    const dateField = "date_" + ("0" + (activeDate.getMonth() + 1)).slice(-2) + "_" + ("0" + activeDate.getDate()).slice(-2) + "_" + activeDate.getFullYear();
    // update renderer to reference field
    renderer.updateRenderer(vaccineLayer, rendererSelect.value, dateField);
    // update popup template to reference field
    popupUtils.updatePopupTemplate(vaccineLayer, rendererSelect.value, dateField);

  }

  // When the user changes the value of the time slider, update the layer to reflect
  // data corresponding to the date indicated on the slider
  timeSlider.watch("values", () => {
    updateLayer();
  });

  //update the map view when the user changes the value of the time slider
  view
    .whenLayerView(vaccineLayer)
    .then(function (layerView) {
      watchUtils.whenFalseOnce(layerView, "updating", function () {
        updateLayer();
      });
    });


  //when the user change the value of the select box, update the layer to reflect
  rendererSelect.addEventListener("change", () => {
    updateLayer();
  });

});