var RDP = require('../../../lib/rdp.js');
var fit = require('../../../lib/curve-fitter.js');

var DEFAULT_TIGHTNESS = 1;
var DEFAULT_T_FACTOR = 1000;

var colors = [
  '#999',
  '#499',
  '#949',
  '#994',
  '#449',
  '#944',
  '#444'
];

function getPseudoRandomColor(i) {
  i = i % colors.length;
  return colors[i];
}

module.exports = {
  setup: function(api) {
    this.api = api;
    api.setSize(600,250);
    api.setPanelCount(1);
    api.setColor('lightgrey');
    api.drawGrid(20,10);

    this.coordinates = [];
    this.reduced = [];

    this.tightness = DEFAULT_TIGHTNESS;
    this.tfactor = DEFAULT_T_FACTOR;

    this.sliders.setOptions([this.tightness * this.tfactor]);
  },

  draw: function(api, curve) {
    var coords = this.coordinates, r = this.reduced;

    // is there a reduced set to draw?
    if (r && r.length > 0) {
      return this.drawCurved(api, coords, r);
    }

    // draw the user supplied path points
    api.setColor('black');
    var last = coords.length - 1;
    if (last >= 0) {
      api.drawPoint(coords[last]);
    }
  },

  drawCurved(api, coords, r) {
    api.reset();
    api.setColor('lightgrey');
    api.drawGrid(20,10);

    api.setColor('rgba(0,0,0,0.3)');
    coords.forEach(p => api.drawPoint(p));

    api.setColor('red');
    r.forEach(p => api.drawPoint(p));

    var curves = [], slice, fc, points, i, e=r.length;

    // make curves
    for(i=0; i<e; i+=3) {
      slice = r.slice(i,i+4);
      fc = fit(slice);
      // for now, don't build if we can't build a cubic.
      if (fc.C.x.length < 4) break;
      points = fc.C.x.map((x,i) => {
        return {
          x: x[0],
          y: fc.C.y[i][0]
        };
      });
      curves.push(new api.Bezier(points));
    }

    api.setColor('purple');
    curves.forEach( (c,i) => {
      api.drawCurve(c);
    });

    // make catmull-rom curves
    curves = [];
    e = r.length;

    var p1, p2, p3, p4, t1, t2, T = 6 * this.tightness;
    for(i=1; i<e-2; i++) { // note: we skip over the points we need virtual information for atm
      p1 = r[i-1];
      p2 = r[i];
      p3 = r[i+1];
      p4 = r[i+2];

      // CR points are {p2,p3,t1,t2} which we convert to
      // B points as per http://localhost:8080/#catmullconv
      var c = new api.Bezier([
        p2,
        { x: p2.x + (p3.x-p1.x)/T, y: p2.y + (p3.y-p1.y)/T },
        { x: p3.x - (p4.x-p2.x)/T, y: p3.y - (p4.y-p2.y)/T },
        p3
      ]);

      curves.push(c);
    }

    api.setColor('olive');
    curves.forEach( (c,i) => {
      api.drawCurve(c);
    });
  },

  onMouseUp: function(evt, api) {
    if (this.coordinates.length < 2) return;
    this.reduced = RDP.runRDP(this.coordinates);
    api.redraw();
  },

  onMouseDrag: function(evt, api) {
    this.coordinates.push({x: api.mx, y: api.my });
    api.redraw();
  },

  updateTightness: function(i, options) {
    var value = options[i];
    this.tightness = value/this.tfactor;
    this.api.redraw();
  },

  getLabel: function(i) {
    return 'Catmull-Rom tightness';
  },

  getValueLabel: function(i) {
    return this.tightness;
  }
};
