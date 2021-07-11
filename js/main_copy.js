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
        center: [-110, 35], // Longitude, latitude for the United States (95.7129 W, 37.0902 N)
        zoom: 3, // Zoom level
        container: "viewDiv" // Div element
    });

    const dotDensityRenderer = new DotDensityRenderer({
        dotValue: 150,
        outline: null,
        referenceScale: 554660, // 1:577,790 view scale
        legendOptions: {
            unit: "doses"
        },
        attributes: [
            {
                // One red dot will be drawn for every 100 White people
                field: "date_05_25_2021",
                color: "#32ef94",
                label: "Covid-19 Vacine Doses"
            },]
    })

    //create a new layer
    const vaccineLayer = new FeatureLayer({
        title: "Covid19 Vaccine Time Series",
        url: "https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/covid19_vaccine_time_series_us_state/FeatureServer/0",
        copyright: "App and maps by <a href=\"https://github.com/YuanWANG2662\">Yuan Wang</a>",
        outFields: ["*"],
        renderer: dotDensityRenderer
    });

    // add the layer to the map
    map.add(vaccineLayer);

    // const search = new Search({
    //   view,
    //   includeDefaultSources: false,
    //   sources: [
    //     new LayerSearchSource({
    //       layer: vaccineLayer,
    //       searchFields: ["Province_State"],
    //       displayField: "Province_State",
    //       suggestionTemplate: "{Province_State}",
    //       searchTemplate: "{Province_State}",
    //       placeholder: "Enter state name",
    //       minSuggestCharacters: 2,
    //       //name: "Counties",
    //       exactMatch: false,
    //       outFields: ["*"]
    //     })
    //   ]
    // });
    // //add the search button
    // view.ui.add(new Expand({
    //   view,
    //   content: search
    // }), "top-left");


    // add the ui controls as an expandable icon
    view.ui.add(new Expand({
        view,
        content: document.getElementById("ui-controls"),
        expandIconClass: "esri-icon-menu",
        expanded: true
    }), "top-left");

    //add the legend
    new Legend({
        view,
        container: "legend"
    });


});