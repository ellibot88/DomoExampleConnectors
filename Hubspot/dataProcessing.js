// define variables
var apiKey = metadata.account.apikey;
var limit = 100;
var URL = '';
var object = '';
httprequest.addHeader('Accept', 'application/json');
httprequest.addHeader('authorization', `Bearer ${metadata.account.apikey}`);


// determine report
switch(metadata.report) {
  
  case 'Deals':
    object = 'deals';
    break;
    
  case 'Companies':
    object = 'companies';
    break;
    
  case 'Contacts':
    object = 'contacts';
    break;
    
}


// process data handler function
function processData(object){
  
URL = `https://api.hubapi.com/crm/v3/objects/${object}?limit=${limit}&archived=false`;  
// loop through API   
do {
  
let res = httprequest.get(URL);
let data = JSON.parse(res).results;
//DOMO.log(data);


// magic parse to Domo dataset
datagrid.magicParseJSON(data);

try{
URL = JSON.parse(res).paging.next.link;

} catch(error){
URL = false;
}
} while (URL);

}

// process data

processData(object);