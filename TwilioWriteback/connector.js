//Set up variables from input parameters
let id = metadata.parameters.datasetId;
let phone = metadata.parameters.phoneNumber;
let message = metadata.parameters.messageBody;
let twilio = metadata.parameters.twilioNumber;
let query = 'select "'+phone+'", "'+message+ '" from tbl';
let data = DOMO.getDataset(id).queryData(query);
let output = data.rows;


//Loop through Data and send text messages
output.forEach(row =>{
  
  //Format POST request to Twilio
  httprequest.addHeader('Authorization', 'Basic ' + DOMO.b64EncodeUnicode(metadata.account.username + ':' + metadata.account.password));
  httprequest.addHeader('Accept', 'application/json');
  let messageBody = 'To='+row[0]+'&From='+twilio+'&Body='+row[1];
  let res = httprequest.post("https://api.twilio.com/2010-04-01/Accounts/"+metadata.account.username+"/Messages.json", messageBody);
 
 
  //Write response back to Domo dataset
  datagrid.magicParseJSON(JSON.parse(res));

});




