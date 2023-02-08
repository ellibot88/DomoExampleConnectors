// DOMO: Set the required headers. This is required only once.
httprequest.addHeader('accesskey', metadata.account.accesskey);
httprequest.addHeader('Accept', 'application/json');
httprequest.addHeader('Content-Type', 'application/json');
//Helper to determine report type

if (metadata.report == 'Company') {
    company();

}
else if (metadata.report == 'Call To Action') {
    cta();

}
else if (metadata.report == 'Task') {
    task();

}
else if (metadata.report == 'Custom Object') {
    customObject();

}
else if (metadata.report == 'Success Plan') {
    successPlan();

}
else if (metadata.report == 'Person') {
    person();

}
else {
    DOMO.log(metadata.report + ' is not a supported report.');
    datagrid.error(0, metadata.report + ' is not a supported report.');
}

//functions

//Company Object 

function company() {
    // DOMO: Use the customername from the authentication section & not the one from the parameters
    let ApiUrl = `https://${metadata.account.customername}.gainsightcloud.com/v1/data/objects/query/Company`;

    let DefinitionUrl = `https://${metadata.account.customername}.gainsightcloud.com/v1/api/describe/MDA/company?ic=true&idd=true`;
    let fields = getFields(DefinitionUrl, r => JSON.parse(r).data.company.fields);
    if (fields !== false) {
        getItems(ApiUrl, fields, 1000, d => d.records);
    }
}

//CTA Object 

function cta() {
    let ApiUrl = `https://${metadata.account.customername}.gainsightcloud.com/v2/cockpit/cta/list`;

    //Get Call To Action Object Definition
    let DefinitionUrl = `https://${metadata.account.customername}.gainsightcloud.com/v1/api/describe/MDA/call_to_action?ic=true&idd=true`;
    let fields = getFields(DefinitionUrl, f => JSON.parse(f).data.call_to_action.fields);
    if (fields != false) {
        getPages(ApiUrl, fields, 100, r => r);
    }
}

//Task Object

function task() {

    let ApiUrl = `https://${metadata.account.customername}.gainsightcloud.com/v2/cockpit/task/list/`;
    let res = httprequest.post(ApiUrl, JSON.stringify({
        "select": [
            "Name"
        ]
    }));
    let data = JSON.parse(res).data;
    datagrid.magicParseJSON(data);
}

//Custom Object

function customObject() {

    let compApiName = metadata.account.customername;
    let customObj = metadata.parameters["Custom Object Name"];
    //DOMO.log(customObj);
    let ApiUrl = `https://${compApiName}.gainsightcloud.com/v1/data/objects/query/${customObj}`;

    //Get Custom Object Definition
    let DefinitionUrl = `https://${compApiName}.gainsightcloud.com/v1/api/describe/MDA/${customObj}?ic=true&idd=true`;
    let fields = getFields(DefinitionUrl, function (response) {
        let defData = response.substr(response.indexOf('['));
        return JSON.parse(defData.substr(0, defData.length - (defData.length - defData.lastIndexOf(']')) + 1));
    });

    if (fields) {
        getItems(ApiUrl, fields, 1000, d => d.records)
    }
}

//Success Plan Object

function successPlan() {
    let ApiUrl = `https://${metadata.account.customername}.gainsightcloud.com/v2/successPlan/list/`;

    getPages(ApiUrl, '["Name"]', 100, d => d);
}

//Person Object
function person() {

    let compApiName = metadata.account.customername;
    let customObj = 'person';
    //DOMO.log(customObj);
    let ApiUrl = `https://${compApiName}.gainsightcloud.com/v1/data/objects/query/${customObj}`;

    //Get Custom Object Definition
    let DefinitionUrl = `https://${compApiName}.gainsightcloud.com/v1/api/describe/MDA/${customObj}?ic=true&idd=true`;
    let fields = getFields(DefinitionUrl, function (response) {
        let defData = response.substr(response.indexOf('['));
        return JSON.parse(defData.substr(0, defData.length - (defData.length - defData.lastIndexOf(']')) + 1));
    });

    if (fields) {
        getItems(ApiUrl, fields, 1000, d => d.records)
    }
}

// DOMO: Get fields to use in the request. Call the provided URL & if the response status is 200, it calls fieldExtractor with the response
// DOMO: the fieldsExtractor should define how to extract fields from the response
function getFields(url, fieldsExtractor) {
    let response = httprequest.get(url);
    if (httprequest.getStatusCode() === 200) {
        let defData = fieldsExtractor(response);
        let array = [];
        defData.forEach(col => {
            array.push(col.fieldName);

        });
        return JSON.stringify(array);
    } else {
        datagrid.error(1, `Error getting field details: ${response}`);
        return false;
    }
}

// DOMO: Get Items in batches. Calls the provided URL repeteadly unless the returned items are not zero
// DOMO: use the fields in select and, limit as limit. Response processor should define how to get the required data from response.data;
function getItems(url, fields, limit, responseProcessor) {
    let counter = 0;
    let i;
    do {
        body = `{"select":${fields},"limit": ${limit}, "offset": ${counter} }`;
        let res = httprequest.post(url, body);
        if (httprequest.getStatusCode() === 200) {
            let data = responseProcessor(JSON.parse(res).data);
            datagrid.magicParseJSON(data);
            counter = counter + limit;
            i = data.length;
        } else {
            datagrid.error(2, `Error getting items: ${res}`);
            break;
        }
    } while (i > 0);
}

function getPages(url, fields, pageSize, responseProcessor) {
    //Loop through API
    let counter = 1;
    let i;
    do {
        body = `{"select":${fields},"pageSize": ${pageSize}, "pageNumber": ${counter} }`;
        let res = httprequest.post(url, body);
        if (httprequest.getStatusCode() === 200) {
            let data = responseProcessor(JSON.parse(res).data);

            datagrid.magicParseJSON(data);
            counter = counter + 1;
            i = data.length;
        } else {
            datagrid.error(2, `Error getting pages: ${res}`);
            break;
        }
    } while (i > 0);
}
