(function (root) {
  var dollabill = root.dollabill;
  var DOMNodeCollection = dollabill.DOMNodeCollection;

  var Event = dollabill.Event = function (event) {
    dollabill.extend(this, event);
  };

  DOMNodeCollection.prototype.events = [];

  DOMNodeCollection.prototype.on = function () {
    if (arguments.length === 2) {
      this.addListener(arguments[0], arguments[1]);
    } else if (arguments.length === 3) {
      var selector = arguments[0];
      var event = arguments[1];
      var handler = arguments[2];
      var that = this;

      this.addListener(event, function (e) {
        var $target = dollabill(e.target);
        var dollaEvent = new Event(e);
        dollaEvent.delegateTarget = that.els[0];

        if ($target.is(selector)) {
          dollaEvent.currentTarget = e.target;
          handler.call(e.target, dollaEvent);
        } else {
          var $parent = $target.closest(selector);

          if ($parent.length > 0) {
            dollaEvent.currentTarget = $parent.els[0];
            handler.call(dollaEvent.currentTarget, dollaEvent);
          }
        }
      });
    }

    return this;
  };

  DOMNodeCollection.prototype.addListener = function (event, handler) {
    var events = this.events;

    this.each(function (i) {
      var boundHandler = function (e) {
        handler.call(this, new Event(e));
      }.bind(this);

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
