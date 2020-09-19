import "requestidlecallback-polyfill";

export default class Interceptor {
    constructor() {
        console.log(this);
    }

    // https://medium.com/better-programming/chrome-extension-intercepting-and-reading-the-body-of-http-requests-dd9ebdf2348b
    interceptData() {
        var xhrOverrideScript = document.createElement("script");
        xhrOverrideScript.type = "text/javascript";
        xhrOverrideScript.innerHTML = `
        (function() {
          var XHR = XMLHttpRequest.prototype;
          var send = XHR.send;
          var open = XHR.open;
          XHR.open = function(method, url) {
              this.url = url; // the request url
              return open.apply(this, arguments);
          }
          XHR.send = function() {
              this.addEventListener('load', function() {
                  if (this.url.includes('<url-you-want-to-intercept>')) {
                      var dataDOMElement = document.createElement('div');
                      dataDOMElement.id = '__interceptedData';
                      dataDOMElement.innerText = this.response;
                      dataDOMElement.style.height = 0;
                      dataDOMElement.style.overflow = 'hidden';
                      document.body.appendChild(dataDOMElement);
                      console.log(this.response);
                  }               
              });
              return send.apply(this, arguments);
          };
        })();
        `;
        document.head.prepend(xhrOverrideScript);
    }
}
