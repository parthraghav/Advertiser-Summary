import "requestidlecallback-polyfill";
import * as config from "./config";

export default class Interceptor {
    constructor() {
        console.log(this);
        this.checkIfDOMIsConstructed();
    }

    interceptData() {
        var xhrOverrideScript = document.createElement("script");
        xhrOverrideScript.type = "text/javascript";
        // https://medium.com/better-programming/chrome-extension-intercepting-and-reading-the-body-of-http-requests-dd9ebdf2348b
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
                  if (this.url.includes('/graphql')) {
                      var dataDOMElement = document.createElement('div');
                      dataDOMElement.className = '${config.INTERCEPTED_RESPONSE_DOM_CLASSNAME}';
                      dataDOMElement.innerText = this.response;
                      dataDOMElement.style.height = 0;
                      dataDOMElement.style.overflow = 'hidden';
                      dataDOMElement.setAttribute('data-queued',true);
                      document.body.appendChild(dataDOMElement);
                  }               
              });
              return send.apply(this, arguments);
          };
        })();
        `;
        document.head.prepend(xhrOverrideScript);
    }

    checkIfDOMIsConstructed() {
        if (document.body && document.head) {
            this.interceptData();
        } else {
            window.requestIdleCallback(this.checkIfDOMIsConstructed.bind(this));
        }
    }
}
