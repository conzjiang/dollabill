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

    var http = new XMLHttpRequest();
    options = $$.extend({}, defaults, options);
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
    http.send(handler.data);

    return http;
  };


  var RequestHandler = function (http, options) {
    $$.extend(this, options);

    this.http = http;
    this.method = this.method.toUpperCase();
    this.data = this.encodeToURI();
    this.setUpURL();
  };

  RequestHandler.prototype.setUpURL = function () {
    if (this.method === "GET") {
      this.url += "?" + this.data;
    }
  };

  var encode = function (key, val) {
    if (typeof val === "object") {
      var queryParams = [];

      for (var attr in val) {
        var param = val[attr];
        queryParams.push(encode(key + "[" + attr + "]", param));
      }

      return queryParams.join("&");
    } else {
      return encodeURIComponent(key) + "=" + encodeURIComponent(val);
    }
  };

  RequestHandler.prototype.encodeToURI = function () {
    var query = [];

    for (var key in this.data) {
      query.push(encode(key, this.data[key]));
    }

    return query.join("&");
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
