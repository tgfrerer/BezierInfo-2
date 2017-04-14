(function() {
  var API = window["Bezier Graphics API"];
  var handlers = window["Bezier Section Handlers"];
  var graphics = Array.from(document.querySelectorAll("canvas[data-section"));

  graphics.forEach(canvas => {
    var section = canvas.getAttribute("data-section");
    var setup = canvas.getAttribute("data-setup");
    var draw = canvas.getAttribute("data-draw");

    var handler = handlers[section].handler;
    var api = Object.assign({}, API);

    // bootstrap this canvas

    var cvs = canvas;
    var dpr = api.getPixelRatio();
    cvs.width = api.defaultWidth * dpr;
    cvs.height = api.defaultHeight * dpr;
    api.cvs = cvs;

    // bootstrap the graphics context
    var ctx = cvs.getContext("2d");
    api.ctx = ctx;
    api.ctx.scale(dpr, dpr);

     // "run" this graphic
//    if (this.props.paperjs) {
//      var Paper = this.Paper = require("../lib/vendor/paperjs/paper-core");
//      Paper.setup(cvs);
//    }

    // event bindings:
    canvas.addEventListener("mousedown", evt => api.mouseDown(evt));
    canvas.addEventListener("mousemove", evt => api.mouseMove(evt));
    canvas.addEventListener("mouseup", evt => api.mouseUp(evt));
    canvas.addEventListener("click", evt => api.onClick(evt));
    canvas.addEventListener("keydown", evt => api.onKeyDown(evt));

    handler.setState = () => { }; // shim
    api.props = {}; // shim

    if (handler.statics) {
      api.props.keyHandlingOptions = handler.statics.keyHandlingOptions;
    } // shim

    handler.state = {}; // shim

    if (setup) {
      var runSetup = handler[setup].bind(handler);
      try {
        runSetup(api);
        api.props.setup = runSetup; // shim
      } catch (e) {
        console.warn(`It seems ${section}/${setup} throws an error:`);
       // console.error(e);
      }
    }

    if (draw) {
      var drawFunction = handler[draw].bind(handler);
      handler.setState = () => { drawFunction(api, api.curve) }; // shim

      try {
        drawFunction(api, api.curve);
        api.props.draw = drawFunction; // shim
      } catch (e) {
        console.warn(`It seems ${section}/${draw} throws an error:`);
        //console.error(e);
      }
    }


//    if (this.props.autoplay) {
//     this.play();
//    }
  });

}());
