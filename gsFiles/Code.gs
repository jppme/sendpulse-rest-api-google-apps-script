
const BaseAPI_URL = 'https://api.sendpulse.com';
const auth_URI = '/oauth/access_token';
const smtp_sendEmail_URI = '/smtp/emails';
/**
 * Your sendPulse client ID and client secret should be added to your 
 * google apps script properties as 'client_id' and 'client_secret' properties
 */

function sendEmail_TEST() {

    let subject = 'sendPulse TEST';
    let htmlBody = '<h1><u>Hola</u> <b>Manola</b></h1>';
    let fromName = 'Google Apps Script';
    let fromEmail = /*<< should be an enabled sender >>*/;
    let toName = 'Test destination email Name';
    let toEmail = /*<< Test destination email address >>*/;

    console.log(
        sendEmail(subject, htmlBody, fromName, fromEmail, toName, toEmail).getContentText() 
    );
    
}

function sendEmail(subject, htmlBody, fromName, fromEmail, toName, toEmail) {

    const request = {
        'email': {
            'html': Utilities.base64Encode(htmlBody),
            'auto_plain_text': true,
            'subject': subject,
            'from': {
                'name': fromName,
                'email': fromEmail
            },
            'to': [
                {
                    'name': toName,
                    'email': toEmail
                }
            ]
        }
    }
    const options = {
        'muteHttpExceptions': false, //improve debug information on development stage
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': getAuth()
        },
        'payload': JSON.stringify(request)
    };
    const response = UrlFetchApp.fetch(BaseAPI_URL + smtp_sendEmail_URI, options);
    return response;
}


// function getAuth_TEST(){

//     const token = getAuth();
//     console.log(token);
// }

function getAuth() { //returns an object

    const scrptProps = PropertiesService.getScriptProperties();
    const expires_in = scrptProps.getProperty('expires_in');
    const auth_time = scrptProps.getProperty('auth_time')/1000;
    const now = new Date()/1000;
    const safety = 60; //seconds

    if ( now - auth_time - expires_in + safety > 0 ){ // expired

        console.log('token: refreshed');
        return doAuthorization_();
    }
    console.log('token: existent');
    return scrptProps.getProperty('token');
}
function doAuthorization_() { //should be called by getAuth

    const scrptProps = PropertiesService.getScriptProperties();
    const client_id = scrptProps.getProperty('client_id');
    const client_secret = scrptProps.getProperty('client_secret');

    const auth_time = Number(new Date());

    const request = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    };
    const options = {
        'muteHttpExceptions': false, //improve debug information on development stage
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        'payload': JSON.stringify(request)
    };
    const response = UrlFetchApp.fetch(BaseAPI_URL + auth_URI, options);
    const responseObject = JSON.parse(response);

    const token = responseObject.token_type + ' ' + responseObject.access_token;
    scrptProps.setProperty('token', token);
    scrptProps.setProperty('expires_in', responseObject.expires_in);
    scrptProps.setProperty('auth_time', auth_time);

    return token;
}
