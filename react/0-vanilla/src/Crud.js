import React, { Component } from 'react';

const ID = function() {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const valid = (firstname, lastname) => {
  return firstname || lastname;
};

class CRUD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      selected: [],
      _firstname: '',
      _lastname: '',
      people: [
        { id: ID(), firstname: 'Jack', lastname: 'Sparrow' },
        { id: ID(), firstname: 'John', lastname: 'Sport' },
        { id: ID(), firstname: 'Kenneth', lastname: 'Sarkin' },
        { id: ID(), firstname: 'Royce', lastname: 'Townsend' },
      ],
    };
  }

  setSelected = selected => {
    if (selected.length === 1) {
      const current = this.state.people.filter(({ id }) => id === selected[0])[0];
      this.setState({
        selected,
        _firstname: current.firstname,
        _lastname: current.lastname,
      });
    } else {
      this.setState({ selected });
    }
  };

  create = () => {
    this.setState({
      people: this.state.people.concat({
        id: ID(),
        firstname: this.state._firstname,
        lastname: this.state._lastname,
      }),
      selected: [],
      _firstname: '',
      _lastname: '',
    });
  };

  update = id => {
    this.setState({
      people: this.state.people.map(p => {
        if (id !== p.id) return p;

        p.firstname = this.state._firstname;
        p.lastname = this.state._lastname;
        return p;
      }),
    });
  };

  delete = selected => {
    this.setState({
      people: this.state.people.filter(p => selected.indexOf(p.id) === -1),
      selected: [],
    });
  };

  render() {
    var people = this.state.people
      .filter(({ lastname }) => lastname.indexOf(this.state.filter) === 0)
      .sort(function(a, b, c) {
        var aName = (a.lastname + ' ' + a.firstname).toLowerCase().trim();
        var bName = (b.lastname + ' ' + b.firstname).toLowerCase().trim();

        if (aName < bName) return -1;
        if (aName > bName) return 1;

        return 0;
      });
    var possibleIds = people.map(({ id }) => id);
    var selected = this.state.selected.filter(id => possibleIds.indexOf(id) !== -1);

    return (
      <div>
        <h2>CRUD - List of People</h2>
        <div className="form-inline">
          <div className="form-group">
            <label htmlFor="filter">Filter</label>{' '}
            <div className="input-group">
              <input
                className="form-control"
                id="filter"
                placeholder="Filter list"
                type="text"
                value={this.state.filter}
                onChange={event => this.setState({ filter: event.target.value })}
              />
              <span className="input-group-btn">
                <button
                  className="btn btn-default"
                  type="button"
                  onClick={() => this.setState({ filter: '' })}>
                  Clear
                </button>
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-6">
            <div className="form-group">
              <label htmlFor="people">People</label>
              <select
                className="form-control"
                id="people"
                multiple={true}
                style={{ minHeight: '108px' }}
                value={selected}
                onChange={({ target }) =>
                  this.setSelected([...target.options].filter(o => o.selected).map(o => o.value))}>
                {people.map(function({ id, firstname, lastname }) {
                  return (
                    <option key={id} value={id}>
                      {lastname && firstname ? `${lastname}, ${firstname}` : firstname || lastname}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="col-xs-6">
            <div className="form-group">
              <label htmlFor="fname">First Name</label>
              <input
                className="form-control"
                id="fname"
                type="text"
                value={this.state._firstname || ''}
                onChange={event => this.setState({ _firstname: event.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lname">Last Name</label>
              <input
                className="form-control"
                id="lname"
                type="text"
                value={this.state._lastname || ''}
                onChange={event => this.setState({ _lastname: event.target.value })}
              />
            </div>
          </div>
        </div>

        <p>
          <button
            className="btn btn-default"
            onClick={this.create}
            disabled={!valid(this.state._firstname, this.state._lastname)}>
            Create
          </button>{' '}
          <button
            className="btn btn-default"
            onClick={() => this.update(selected[0])}
            disabled={selected.length !== 1}>
            Update
          </button>{' '}
          <button
            className="btn btn-danger"
            onClick={() => this.delete(selected)}
            disabled={selected.length === 0}>
            Delete
          </button>
        </p>
      </div>
    );
  }
}

export default CRUD;
