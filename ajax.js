(function (root) {
  var $$ = root.$$;

  $$.ajax = function (options) {
    var defaults = {
      success: function () {},
      error: function () {},
      url: "",
      method: "GET",
      data: "",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8"
    };

    options = $$.extend({}, defaults, options);

    var http = new XMLHttpRequest();
    var handler = new RequestHandler(http, options);

    http.onreadystatechange = function () {
      if (http.readyState === XMLHttpRequest.DONE) {
        var response = handler.parseResponse();

        if (http.status >= 200 && http.status < 300) {
          options.success(response, http);
        } else {
          options.error(response, http);
        }
      }
    };


    http.open(handler.method, handler.url);
    handler.setRequestHeaders();
    http.send(new FormData(options.data));

    return http;
  };

  var RequestHandler = function (http, options) {
    $$.extend(this, options);

    this.http = http;
    this.method = this.method.toUpperCase();
    this.setUpURL();
  };

  RequestHandler.prototype.setUpURL = function () {
    if (this.method === "GET") {
      this.url += "?" + this.encodeToURI();
    }
  };

  RequestHandler.prototype.encodeToURI = function () {
    var queryStr = "";

    for (var key in this.data) {
      queryStr += this.encode(key) + "=" + this.encode(this.data[key]);
    }

    return queryStr;
  };

  RequestHandler.prototype.encode = function (arg) {
    return encodeURIComponent(arg);
  };

  RequestHandler.prototype.setRequestHeaders = function () {
    if (this.method === "POST") {
      this.http.setRequestHeader("Content-Type", this.contentType);
    }

    if (this.dataType) {
      var headerVal;

      if (["text", "html"].indexOf(this.dataType) !== -1) {
        headerVal = "text/" + this.dataType;
      } else {
        headerVal = "application/" + this.dataType;
      }

      this.http.setRequestHeader("Accept", headerVal);
    }
  };

  RequestHandler.prototype.parseResponse = function () {
    var contentTypeHeader = this.http.getResponseHeader("content-type");

    if (contentTypeHeader && contentTypeHeader.match("json")) {
      return JSON.parse(this.http.responseText);
    } else {
      return this.http.responseText;
    }
  };
})(this);
