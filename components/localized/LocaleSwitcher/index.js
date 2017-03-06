var React = require('react');

var Locale = require("../../../lib/locale");
var locale = new Locale();
var page = "locale-switcher";

module.exports = function(props) {
  let content = locale.getContent(page, this);
  if (window['no locale was set for the primer']) {
    let items = content.props.children[1].props.children;
    items.forEach(item => {
      let a = item.props.children;
      a.props.href = a.props.href.replace('../','');
    });
  }
  return <div className="locale-switcher">{ content }</div>;
};
