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
    //return { dotDensityRenderer };
    exports.dotDensityRenderer = dotDensityRenderer;
});

