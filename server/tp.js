var HumorApi = require('humor_api');

var defaultClient = HumorApi.ApiClient.instance;
// Configure API key authorization: apiKey
var apiKey = defaultClient.authentications['apiKey'];
apiKey.apiKey = "13f75c3fd1ab4930bc17064796c6fe56"
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//apiKey.apiKeyPrefix['api-key'] = "Token"

var api = new HumorApi.MemesApi()
var opts = {
  'body': "body_example" // {String} Post the joke as plain text.
};
var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data) );
  }
};
api.searchMemes(opts, callback);