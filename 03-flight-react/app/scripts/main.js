'use strict';

var FlightOptions = React.createClass({
	render: function() {
		return React.createElement('select', {value: 'Return'},
			React.createElement('option', {value: 'OneWay'}, "One Way"),
			React.createElement('option', {value: 'Return'}, "Return")
		);
	}
});

var DateInput = React.createClass({
	render: function() {
		var invalid = this.props.disabled !== true && (
			this.props.valid === false
			|| false // internal checks?
		);
		return React.createElement('input', {
			value: this.props.date,
			disabled: this.props.disabled,
			style: invalid ? {color: 'red'} : null
		});
	}
});

var FlightBooker = React.createClass({
	render: function() {
		return (
			React.createElement('div', null,
				React.createElement(FlightOptions, null),
				React.createElement('br'),
				React.createElement(DateInput, {date: '27.03.2014', valid: false}),
				React.createElement('br'),
				React.createElement(DateInput, {date: '27.03.2014', disabled: true}),
				React.createElement('br'),
				React.createElement('button', null, "Book")
			)
		);
	}
});

React.render(
	React.createElement(FlightBooker, null),
	document.getElementById('app')
);