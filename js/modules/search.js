// define module: search
define([
    "require",
    "exports",
    "esri/widgets/Search",
    "esri/widgets/Search/LayerSearchSource",
], function (
    require,
    exports,
    Search,
    LayerSearchSource,
) {
    const searchState = new Search({
        view,
        includeDefaultSources: true,
        sources: [
            new LayerSearchSource({
                layer: vaccineLayer,
                searchFields: ["Province_State", "STUSPS"],
                displayField: "Province_State",
                suggestionTemplate: "{Province_State},{STUSPS}",
                searchTemplate: "{Province_State},{STUSPS}",
                placeholder: "Enter state name",
                minSuggestCharacters: 1,
                //name: "Counties",
                exactMatch: false,
                outFields: ["*"]
            })
        ]
    });
    exports.search = searchState;
});