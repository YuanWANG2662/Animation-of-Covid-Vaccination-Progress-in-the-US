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
  //import custom modules
  "./js/modules/renderer.js",
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
  //custom modules
  renderer,
) {
  // configure the ArcGIS API key
  esriConfig.apiKey = "AAPK4a51d51457ca47989323c81844ad3f32dID99_JGrxrl1acdATUne0knPXdE79jfqrYCVYUzQ_eevAeai9VKIaZpx15lNhkE";

  //create a new layer
  const vaccineLayer = new FeatureLayer({
    title: "Covid19 Vaccine Time Series",
    url: "https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/covid19_vaccine_time_series_us_state/FeatureServer/0",
    copyright: "App and maps by <a href=\"https://github.com/YuanWANG2662\">Yuan Wang</a>",
    outFields: ["*"],
    renderer: renderer.dotDensityRenderer // imported from the 'renderer' module
  });

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

  // configure custom search
  const search = new Search({
    view,
    includeDefaultSources: true,
    sources: [
      new LayerSearchSource({
        layer: vaccineLayer,
        searchFields: ["Province_State", "STUSPS"],
        displayField: "Province_State",
        suggestionTemplate: "{Province_State},{STUSPS}",
        placeholder: "Enter state name",
        minSuggestCharacters: 1,
        exactMatch: false,
        outFields: ["*"]
      })
    ]
  });

  //add the search button
  view.ui.add(new Expand({
    view,
    content: search
  }), "top-right");

  // add the ui controls as an expandable icon
  view.ui.add(new Expand({
    view,
    content: document.getElementById("ui-controls"),
    expandIconClass: "esri-icon-menu",
    expanded: true
  }), "top-left");

  view.ui.add("time-slider-toggle", "bottom-left");
  view.ui.add("timeSliderDiv", "bottom-left");

  const timeVisibilityBtn = document.getElementById("time-slider-toggle");
  const timeSliderDiv = document.getElementById("timeSliderDiv");

  timeVisibilityBtn.addEventListener("click", toggleTimeOptionsVisibility);

  function toggleTimeOptionsVisibility() {

    timeSliderDiv.style.visibility = (timeSliderDiv.style.visibility === "hidden") ? "visible" : "hidden";

    //console.log(timeSliderDiv.style.visibility);

    if (timeVisibilityBtn.classList.contains("esri-icon-time-clock")) {
      timeVisibilityBtn.classList.replace("esri-icon-time-clock", "esri-icon-expand");
    } else {
      timeVisibilityBtn.classList.replace("esri-icon-expand", "esri-icon-time-clock");
    }
  }


  // configure timeSlider 
  const initialTimeExtent = {
    start: new Date(2020, 11, 14),  // 2020.12.14 new Date(year, monthIndex, day)
    end: new Date(2021, 6, 3)       //  2021.7.3  new Date(year, monthIndex, day)
  }
  const timeSlider = new TimeSlider({
    container: "timeSliderDiv",
    playRate: 100,
    loop: true,
    viewModel: {
      view: view,
      mode: "instant",
      fullTimeExtent: initialTimeExtent,
    },
    // fullTimeExtent: initialTimeExtent,
    // mode: "instant",
    values: [initialTimeExtent.end],
    stops: {
      interval: {
        value: 1,
        unit: "days"
      }
    }
  });

  // timeSlider.on(["thumb-change", "thumb-drag"], (event) => {
  //   const renderer = vaccineLayer.renderer.clone();
  //   // update renderer to reference field
  //   // representing selected year on the slider
  //   const date = event.value;
  //   const fieldName = "date_" + date.getMonth() + 1 + "_" + date.getDate() + "_" + date.getFullYear();
  //   console.log(fieldName);
  //   renderer.attributes.filed = fieldName;
  //   vaccineLayer.renderer = renderer;
  // });


  timeSlider.watch("values", () => {
    const renderer = vaccineLayer.renderer.clone();
    // update renderer to reference field
    // representing selected year on the slider
    const date = timeSlider.values[0];
    const fieldName = "date_" + ("0" + (date.getMonth() + 1)).slice(-2) + "_" + ("0" + date.getDate()).slice(-2) + "_" + date.getFullYear();
    console.log(fieldName);
    renderer.attributes.filed = fieldName;
    vaccineLayer.renderer = renderer;
  });

});