// define module: popupUtils
define([
    "require",
    "exports",
], function (
    require,
    exports,
) {

    createPopupTemplate = function (popopType, dateField) {
        switch (popopType) {
            case 'total-doses': {
                const template = {
                    title: "{NAME}, {STUSPS} on" + dateField,
                    content: [
                        {
                            type: "fields",
                            fieldInfos: [
                                {
                                    fieldName: dateField, // The field whose values you want to format
                                    label: "Total Vaccine Doses",
                                    format: {
                                        digitSeparator: true, // Uses a comma separator in numbers >999
                                    }
                                }]
                        }],
                };

                return template;
            }
            case 'vaccination-rate': {
                const template = {
                    title: "{NAME}, {STUSPS}",
                    content: [
                        {
                            type: "fields",
                            fieldInfos: [
                                {
                                    fieldName: "expression/vaccination_rate", // The field whose values you want to format
                                    label: "Total Vaccinations per Hundred",
                                    format: {
                                        places: 2 // Sets the number of decimal places to 2 and rounds up
                                    }
                                }]
                        }],
                    expressionInfos: [
                        {
                            name: "vaccination_rate",
                            title: "Total Vaccinations per Hundred",
                            expression: "($feature." + dateField + "/$feature.Population)*100"
                        }]
                };
                return template;
            }
        }

    }

    updatePopupTemplate = function (layer, popopType, dateField) {
        // switch (popopType) {
        //     case 'total-doses': {
        //                     }
        //     case 'vaccination-rate': {

        //     }
        // }
        const template = createPopupTemplate(popopType, dateField);
        layer.popupTemplate = template;

    }

    exports.createPopupTemplate = createPopupTemplate;
    exports.updatePopupTemplate = updatePopupTemplate;


});