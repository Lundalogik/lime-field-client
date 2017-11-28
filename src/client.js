
//isomorphify start

require('es6-promise').polyfill();
require('isomorphic-fetch');
const btoa = require('isomorphic-base64').btoa;

//isomorphic end

const command = require('./commands')

module.exports = function (base_url, user, password) {

  const headers = new Headers();

  headers.append('Authorization', 'Basic ' + btoa(user + ":" + password));
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");


  var client =  {
    get:function (url) {
      var init = { method: 'GET',
                     headers: headers,
                     mode: 'cors',
                     cache: 'default' };
      return fetch(base_url + '/api/' + url, init).then((response)=>{

        if(!response.ok) {
          console.console.error('something went wrong', response);
          return null; // reject promise here?
        }
        return response.json();
      });
    },
    post: function (url, data) {
      var init = { method: 'POST',
                     headers: headers,
                     mode: 'cors',
                     cache: 'default',
                     body: JSON.stringify(data)
                    };
      return fetch(base_url + '/api/' + url, init).then((response)=>{
        if(!response.ok) {
          console.error('something went wrong', response);
          return null; // reject promise here?
        }
        return response.json();
      });
    }
  };

  client.postCommands = function (commands) {
        var filterNulls = function (item) {
          if (item) return false;
          return true;
        };

      var commandBatch = {Id: '', Commands: commands};

      return new Promise((res, err)=>{
        if (!commands.length || commands.filter(filterNulls).length) {
          err();
          return;
        }
        client.post('commands', commandBatch).then((result)=>{
            if (result.HasErrors) {
              console.error('Response has command errors');
              console.error(result);
              err(result);
            } else {
              res(result);
            }
          },err);
      });
  };

  client.command = command(c);

  return client;
};
