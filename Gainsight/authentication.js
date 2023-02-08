let custNameFormat = /^[A-Za-z0-9\-]{3,30}$/;
if (custNameFormat.test(metadata.account.customername)) {       // DOMO: Check if the input values are as expected. Prevent access to attackers
    // Adding the api key in the query parameter
    httprequest.addHeader('accesskey', metadata.account.accesskey);
    httprequest.addHeader('Accept', 'application/json');        // DOMO: Otherwise, an HTML page is returned by the API on error with 200 status code.

    // Making the call to the api endpoint
    //let res = httprequest.get(`https://${metadata.account.customername}.gainsightcloud.com/v1/data/objects/query/Company`);   // DOMO: This one isn't working with GET
    let res = httprequest.get(`https://${metadata.account.customername}.gainsightcloud.com/v1/api/describe/MDA/company`);       // DOMO: This one works
    // Make sure to determine and set the authentication status to either success or failure.
    if (httprequest.getStatusCode() === 200) {
        auth.authenticationSuccess();
    } else {
        auth.authenticationFailed('The api key you entered is invalid. Please try again with a valid key.');
    }
} else {
    auth.authenticationFailed('Invalid customer name. Please try again with a valid customer name.');
}