let userInput = /^[a-zA-Z0-9-]*$/;
//DOMO.log(metadata.account.apikey)
if (userInput.test(metadata.account.apikey)) {       // Check if the input values are as expected. Prevent access to attackers
    
    httprequest.addHeader('Accept', 'application/json');
    httprequest.addHeader('authorization', `Bearer ${metadata.account.apikey}`);

    // Making the call to the api endpoint
   
    let res = httprequest.get(`https://api.hubapi.com/crm/v3/objects/contacts?limit=1&archived=false`);     
    // Make sure to determine and set the authentication status to either success or failure.
    
    
    if (httprequest.getStatusCode() === 200) {
        auth.authenticationSuccess();
    } else {
        auth.authenticationFailed('The api key you entered is invalid. Please try again with a valid key.');
    }
} else {
    auth.authenticationFailed('Invalid customer name. Please try again with a valid customer name.');
}