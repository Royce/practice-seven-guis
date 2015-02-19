var Counter = React.createClass({
	getInitialState: function() {
		return {count: 0};
	},
	increment: function(e) {
		e.preventDefault();
		this.setState({count: this.state.count + 1});
	},
	render: function() {
		return (
			React.createElement('div', {className: "eouo"},
				React.createElement('input', {value: this.state.count}),
				React.createElement('Button', {onClick: this.increment}, "Count")
			)
		);
	}
});

React.render(
	React.createElement(Counter, null),
	document.getElementById('app')
);