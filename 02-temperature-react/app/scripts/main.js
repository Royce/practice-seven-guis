var _new_temp = function _new_temp (that, changed_key, other_key) {
	var state = that.state;
	var new_value = that.refs[changed_key].getDOMNode().value.trim();
	that.state[changed_key] = new_value;

	var parsed = parseFloat(new_value);
	if (!isNaN(parsed)) {
		state[other_key] = that.to[other_key](parsed);
	}

	that.setState(state);
}

var Converter = React.createClass({
	getInitialState: function() {
		return {celsius: null, fahrenheit: null};
	},
	to: {
		celsius: function(f) {
			return (f - 32.0) * (5.0/9.0);
		},
		fahrenheit: function(c) {
			return (c * (9.0/5.0) + 32.0);
		}
	},
	new_temp_celsius: function() {
		_new_temp(this, "celsius", "fahrenheit");
	},
	new_temp_fahrenheit: function() {
		_new_temp(this, "fahrenheit", "celsius");
	},
	render: function() {
		return (
			React.createElement('div', null,
				React.createElement('input', {
					value: this.state.celsius,
					ref: "celsius",
					onChange: this.new_temp_celsius
				}),
				"Celsius = ",
				React.createElement('input', {
					value: this.state.fahrenheit,
					ref: "fahrenheit",
					onChange: this.new_temp_fahrenheit
				}),
				"Fahrenheit"
			)
		);
	}
});

React.render(
	React.createElement(Converter, null),
	document.getElementById('app')
);