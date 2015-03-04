'use strict';

var FlightBooker = React.createClass({
	getInitialState: function() {
		return {depart: '27.03.2014', return: '27.04.2014'};
	},
	render: function() {
		return (
			React.createElement('div', null,
				React.createElement('select', {value: 'Return'},
					React.createElement('option', {value: 'OneWay'}, "One Way"),
					React.createElement('option', {value: 'Return'}, "Return")),
				React.createElement('br'),
				React.createElement('input', {
					value: this.state.depart,
					ref: "depart"
				}),
				React.createElement('br'),
				React.createElement('input', {
					value: this.state.return,
					ref: "return"
				}),
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