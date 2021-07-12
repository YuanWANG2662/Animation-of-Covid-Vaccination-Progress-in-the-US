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
    createRenderer = function (rendererType, dateField) {
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
                            field: dateField,
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
                        valueExpression: '( $feature.' + dateField + '/ $feature.Population ) * 100',
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

    updateRenderer = function (layer, rendererType, dateField) {
        const renderer = createRenderer(rendererType, dateField);
        layer.renderer = renderer;
    }

    exports.createRenderer = createRenderer;
    exports.updateRenderer = updateRenderer;
});

