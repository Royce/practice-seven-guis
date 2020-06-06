'use strict';

var FlightOptions = React.createClass({
	handleChange: function(e) {
		this.props.onUpdate(this.refs.option.getDOMNode().value)
	},
	render: function() {
		return React.createElement('select', {
				value: this.props.option,
				ref: 'option',
				onChange: this.handleChange
			},
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
		var invalid = this.props.disabled !== true &&
			this.state.invalidValue !== null
		;
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
			depart: moment().startOf('day'),
			'return': moment().startOf('day')};
	},
	onNewFlightOption: function(o) {
		var state = this.state;
		state.flightOption = o;
		this.setState(state);
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
				React.createElement(FlightOptions, {
					option: this.state.flightOption,
					onUpdate: this.onNewFlightOption
				}),
				React.createElement('br'),
				React.createElement(DateInput, {
					date: this.state.depart,
					onUpdate: this.onNewDepartDate}),
				React.createElement('br'),
				React.createElement(DateInput, {
					date: this.state.return,
					onUpdate: this.onNewReturnDate,
					disabled: this.state.flightOption !== 'Return'
				}),
				React.createElement('br'),
				React.createElement('button', {
					disabled: this.state.flightOption === 'Return' &&
						this.state.return.isBefore(this.state.depart)
				}, "Book"),
				React.createElement('span', null, this.state.flightOption === 'Return'
					? ("a journey departing " + this.state.depart.calendar() +
						", returning " + this.state.return.calendar())
					: ("a one-way flight departing " + this.state.depart.calendar()))
			)
		);
	}
});

React.render(
	React.createElement(FlightBooker, null),
	document.getElementById('app')
);