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
	getInitialState: function() {
		return { invalidValue: null };
	},
	handleChange: function() {
		var raw = this.refs.date.getDOMNode().value;

		var m = moment(raw, "DD.MM.YYYY", true);

		if (m.isValid()) {
			this.props.onUpdate(m);
		}

		this.setState({invalidValue: m.isValid() ? null: raw});
	},
	finishEdit: function() {
		this.setState({invalidValue:null});
	},
	render: function() {
		var invalid = this.props.disabled !== true && (
			this.props.valid === false ||
			this.state.invalidValue !== null
		);
		return React.createElement('input', {
			value: this.state.invalidValue || this.props.date.format("DD.MM.YYYY"),
			ref: "date",
			onChange: this.handleChange,
			onBlur: this.finishEdit,
			disabled: this.props.disabled,
			style: invalid ? {color: 'red'} : null
		});
	}
});

var FlightBooker = React.createClass({
	getInitialState: function() {
		return {
			flightOption: 'Return',
			depart: moment(),
			'return': moment()};
	},
	onNewDepartDate: function(m) {
		var state = this.state;
		state.depart = m;
		this.setState(state);
	},
	onNewReturnDate: function(m) {
		var state = this.state;
		state.return = m;
		this.setState(state);
	},
	render: function() {
		return (
			React.createElement('div', null,
				React.createElement(FlightOptions, null),
				React.createElement('br'),
				React.createElement(DateInput, {
					date: this.state.depart,
					onUpdate: this.onNewDepartDate}),
				React.createElement('br'),
				React.createElement(DateInput, {
					date: this.state.return,
					onUpdate: this.onNewReturnDate,
					disabled: true}),
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