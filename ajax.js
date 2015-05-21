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
    var http = new AjaxRequest(options);

    http.open();
    http.setRequestHeaders();
    http.send();

    return http;
  };


  var AjaxRequest = function (options) {
    $$.extend(this, options);

    this.http = new XMLHttpRequest();
    this.method = this.method.toUpperCase();
    this.encodeToURI();
    this.setUpURL();
    this.bindListeners();
  };

  AjaxRequest.prototype.encodeToURI = function () {
    var query = [];

    for (var key in this.data) {
      query.push(encode(key, this.data[key]));
    }

    this.data = query.join("&");
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

  AjaxRequest.prototype.setUpURL = function () {
    if (this.method === "GET") {
      this.url += "?" + this.data;
    }
  };

  AjaxRequest.prototype.bindListeners = function () {
    this.http.onreadystatechange = this.handleResponse.bind(this);
  };

  AjaxRequest.prototype.handleResponse = function () {
    if (this.http.readyState === XMLHttpRequest.DONE) {
      var response = this.parseResponse();

      if (this.http.status >= 200 && this.http.status < 300) {
        this.success(response, this.http);
      } else {
        this.error(response, this.http);
      }
    }
  };

  AjaxRequest.prototype.parseResponse = function () {
    var contentTypeHeader = this.http.getResponseHeader("content-type");

    if (contentTypeHeader && contentTypeHeader.match("json")) {
      return JSON.parse(this.http.responseText);
    } else {
      return this.http.responseText;
    }
  };

  AjaxRequest.prototype.open = function () {
    this.http.open(this.method, this.url);
  };

  AjaxRequest.prototype.setRequestHeaders = function () {
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

  AjaxRequest.prototype.send = function () {
    this.http.send(this.data);
  };
})(this);
