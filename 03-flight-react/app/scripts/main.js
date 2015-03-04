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
		return React.createElement('input', {
			value: this.props.date
		});
	}
});

var FlightBooker = React.createClass({
	render: function() {
		return (
			React.createElement('div', null,
				React.createElement(FlightOptions, null),
				React.createElement('br'),
				React.createElement(DateInput, {date: '27.03.2014'}),
				React.createElement('br'),
				React.createElement(DateInput, {date: '27.03.2014'}),
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