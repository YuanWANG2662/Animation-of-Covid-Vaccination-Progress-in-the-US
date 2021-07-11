// define module: renderer
// define(["esri/renderers/DotDensityRenderer"], function (DotDensityRenderer) {
define([
    "require",
    "exports",
    "esri/renderers/DotDensityRenderer"
], function (
    require,
    exports,
    DotDensityRenderer
) {
    createRenderer = function (rendererType) {
        switch (rendererType) {
            case "daily-doses": {
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
                            field: "date_07_03_2021",
                            color: "#32ef94",
                            label: "Covid-19 Vacine Doses"
                        },]
                })

                return dotDensityRenderer;
                break;
            }
            case "vaccination-rate": {
                const defaultSym = {
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    outline: {
                        // autocasts as new SimpleLineSymbol()
                        color: [128, 128, 128, 0.2],
                        width: "0.5px"
                    }
                };
                const renderer = {
                    type: "simple", // autocasts as new SimpleRenderer()
                    symbol: defaultSym,
                    label: "U.S. County",
                    visualVariables: [
                        {
                            type: "color",
                            field: "date_07_03_2021",
                            normalizationField: "Population",
                            legendOptions: {
                                title: "% population in poverty by county"
                            },
                            stops: [
                                {
                                    value: 0.1,
                                    color: "#FFFCD4",
                                    label: "<10%"
                                },
                                {
                                    value: 0.3,
                                    color: "#350242",
                                    label: ">30%"
                                }
                            ]
                        }
                    ]
                };
            }
        }

    };

    exports.createRenderer = createRenderer;

    function updateRenderer(layer, dateValue) {
        renderer = layer.renderer.clone();
        const date = dateValue;
        const fieldName = "date_" + ("0" + (date.getMonth() + 1)).slice(-2) + "_" + ("0" + date.getDate()).slice(-2) + "_" + date.getFullYear();
        //console.log(fieldName);
        renderer.attributes[0].field = fieldName;
        layer.renderer = renderer;
    }

    exports.updateRenderer = updateRenderer;
});

