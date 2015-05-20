(function (root) {
  var $$ = root.$$;
  var DOMNodeCollection = $$.DOMNodeCollection;

  DOMNodeCollection.prototype.events = [];

  DOMNodeCollection.prototype.on = function (event, handler) {
    var events = this.events;

    this.each(function (i) {
      var boundHandler = handler.bind(this);
      var eventHandler = events[i] = (events[i] || new EventHandler(this));
      eventHandler.addEventListener(event, boundHandler);
    });

    return this;
  };

  DOMNodeCollection.prototype.off = function (event) {
    var events = this.events;

    this.each(function (i) {
      var eventHandler = events[i];
      if (!eventHandler) return;

      eventHandler.removeEventListener(event);
    });

    return this;
  };

  var EventHandler = function (el) {
    this.el = el;
    this.events = {};
  };

  EventHandler.prototype.addEventListener = function (event, handler) {
    var eventHandlers = this.getHandlers(event);
    eventHandlers.push(handler);
    this.el.addEventListener(event, handler);
  };

  EventHandler.prototype.removeEventListener = function (event) {
    this.getHandlers(event).forEach(function (handler) {
      this.el.removeEventListener(event, handler);
    }.bind(this));

    this.events[event] = [];
  };

  EventHandler.prototype.getHandlers = function (event) {
    this.events[event] = (this.events[event] || []);
    return this.events[event];
  };
})(this);
