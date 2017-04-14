var React = require("react");
var noop = require("../../lib/noop");

module.exports = function(Component) {
  var options = Component.keyHandlingOptions,
      propName = options.propName || "",
      values = options.values || {},
      controller = options.controller || noop,
      defaultProps = Component.defaultProps || Component.getDefaultProps(),
      ref = "wrappedComponent";

  var ComponentClass = {
    values,
    defaultProps,

    onKeyDown: function(event, api) {
      var v = this.values[event.keyCode];
      if(v) {
        event.preventDefault();
        if (typeof v === "function") {
          v(api);
        } else {
          api[propName] += v;
          controller(api);
        }
      }
    },

    getComponent: function() {
      var wrappedComponent = this.refs[ref];
      if (wrappedComponent.getComponent) {
        return wrappedComponent.getComponent();
      }
      return wrappedComponent;
    },

    render: function() {
      return <Component {...this.props} onKeyDown={this.onKeyDown} ref={ref} />;
    }
  };

  return React.createClass(ComponentClass);
};
