
function logAllDomsAndSndrs() {

  getSendersList_();
  getAllowedDomains_();
}


function getAllowedDomains_() {

  const options = {
    'muteHttpExceptions': false, //improve debug information on development stage
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': getAuth()
    }
  };
  const response = UrlFetchApp.fetch('https://api.sendpulse.com/v2/email-service/smtp/sender_domains', options);

  console.log(JSON.stringify(JSON.parse(response.getContentText()), null, 4));
  return response;
}

function getSendersList_() {

  const options = {
    'muteHttpExceptions': false, //improve debug information on development stage
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': getAuth()
    }
  };
  const response = UrlFetchApp.fetch('https://api.sendpulse.com/smtp/senders', options);

  console.log(JSON.stringify(JSON.parse(response.getContentText()), null, 4));
  return response;
}
