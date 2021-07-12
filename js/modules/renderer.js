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
            case "total-doses": {
                const dotDensityRenderer = new DotDensityRenderer({
                    dotValue: 150,
                    outline: null,
                    referenceScale: 554660, // 1:577,790 view scale
                    legendOptions: {
                        unit: "Doses"
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
                //break;
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
                    label: "U.S. State",
                    visualVariables: {
                        type: "color",
                        valueExpression: "( $feature.date_07_03_2021 / $feature.Population ) * 100",
                        valueExpressionTitle: "Total vaccinations per hundred",
                        stops: [
                            { value: 0.1, color: "#EAFAF1" },
                            { value: 5, color: "#D5F5E3" },
                            { value: 30, color: "#ABEBC6" },
                            { value: 60, color: "#58D68D" },
                            { value: 80, color: "#28B463" },
                            { value: 100, color: "#1D8348" },
                            { value: 120, color: "#145A32" }
                        ]
                    }

                };

                return renderer;
                //break;
            }
        }

    };

    function updateRenderer(layer, dateValue, rendererType) {
        switch (rendererType) {
            case "total-doses": {
                const renderer = createRenderer(rendererType);
                const date = dateValue;
                const fieldName = "date_" + ("0" + (date.getMonth() + 1)).slice(-2) + "_" + ("0" + date.getDate()).slice(-2) + "_" + date.getFullYear();
                //console.log(fieldName);
                renderer.attributes[0].field = fieldName;
                layer.renderer = renderer;
                break;
            }
            case "vaccination-rate": {
                const renderer = createRenderer(rendererType);
                const date = dateValue;
                const fieldName = "date_" + ("0" + (date.getMonth() + 1)).slice(-2) + "_" + ("0" + date.getDate()).slice(-2) + "_" + date.getFullYear();
                renderer.visualVariables.valueExpression = '( $feature.' + fieldName + '/ $feature.Population ) * 100';
                layer.renderer = renderer;
                break;
            }
        }

    }

    exports.createRenderer = createRenderer;
    exports.updateRenderer = updateRenderer;
});

