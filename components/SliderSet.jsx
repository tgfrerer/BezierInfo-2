var React = require("react");

/**
 * Use as <SliderSet options={ [v1, v2, ...] } getLabel={ function() } />
 */
class SliderSet extends React.Component {
  constructor(props) {
    super(props);
    this.options = props.options || [];
  }

  render(props) {
    props = props || {};
    var min = props.min || 0;
    var max = props.max || 1;
    var step = props.step || (max-min) / 100;

    var getLabel = props.getLabel;
    var getValueLabel = props.getValueLabel;

    var rows = this.options;
    var sliders = rows.map( (v,i) => {
      var label = getLabel ? getLabel(i) : <span>t<sub>{ i }</sub></span>;
      var valueLabel = getValueLabel ? getValueLabel(i) : (v + "").substring(0,4);
      return (
        <div>
          <label>{ label }</label>
          <input
            type="range"
            key={`row${i}`}
            min={min}
            max={max}
            defaultValue={v}
            step={step}
            onChange={e => {
              this.options[i] = e.target.value;
              props.onChange(i, this.options);
              this.forceUpdate();
            }} />
            <span>{ valueLabel }</span>
        </div>
      );
    });
    return <div>{ sliders }</div>;
  }

  setOptions(options, labels) {
    this.options = options;
    this.forceUpdate();
  }
}

module.exports = SliderSet;
