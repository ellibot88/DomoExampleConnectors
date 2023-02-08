if(validateCreds())  {

	httprequest.addHeader('Authorization', 'Basic ' + DOMO.b64EncodeUnicode(metadata.account.username + ':' + metadata.account.password));
	httprequest.addHeader('Content-Type', 'application/json');
	
	var res = httprequest.get('https://api.twilio.com/2010-04-01/Accounts/'+metadata.account.username+'/Messages.json');  
	
	//.log('res: ' + res);
	
	if(httprequest.getStatusCode() == 200){
	  auth.authenticationSuccess();
	}
	else{
	  auth.authenticationFailed('Your username and password are incorrect');
	}
} else {
	auth.authenticationFailed('Invalid values. Please check for the credentials passed');
}

function validateCreds() {
	var pattern = "^[a-zA-Z0-9]+$";
	if(metadata.account.username.match(pattern)){
		return true;
	}
	return false;
}