import React, { useState, useMemo } from 'react';

const ID = function() {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const valid = (firstname, lastname) => {
  return firstname || lastname;
};

const filterPeople = (filter, people) => {
  return people
    .filter(({ lastname, firstname }) =>
      lastname.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) === 0
      || firstname.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) === 0)
    .sort(function(a, b, c) {
      var aName = (a.lastname + ' ' + a.firstname).toLowerCase().trim();
      var bName = (b.lastname + ' ' + b.firstname).toLowerCase().trim();

      if (aName < bName) return -1;
      if (aName > bName) return 1;

      return 0;
    });
};

const filterIndexes = (filteredPeople, indexes) => {
  const possibleIds = filteredPeople.map(({ id }) => id);
  return indexes.filter(id => possibleIds.indexOf(id) !== -1);
}

function CRUD() {
  const [filter, setFilter] = useState('');
  const [people, setPeople] = useState([
    { id: ID(), firstname: 'Jack', lastname: 'Sparrow' },
    { id: ID(), firstname: 'John', lastname: 'Sport' },
    { id: ID(), firstname: 'Kenneth', lastname: 'Sarkin' },
    { id: ID(), firstname: 'Royce', lastname: 'Townsend' },
  ]);
  const [selected, setSelected] = useState({
    indexes: [],
    firstName: '',
    lastName: '',
  });

  const setIndexes = indexes => {
    if (indexes.length === 1) {
      const current = people.filter(({ id }) => id === indexes[0])[0];
      setSelected({
        indexes,
        firstname: current.firstname,
        lastname: current.lastname,
      });
    } else {
      setSelected({ ...selected, indexes });
    }
  };

  const create = () => {
    setPeople(people.concat({
      id: ID(),
      firstname: selected.firstname,
      lastname: selected.lastname,
    }));
    setSelected({
      indexes: [],
      firstName: '',
      lastName: ''
    });
  };

  const update = id => {
    setPeople(people.map(p => {
      if (id !== p.id) return p;

      p.firstname = selected.firstname;
      p.lastname = selected.lastname;
      return p;
    }));
  };

  const remove = indexes => {
    setPeople(people.filter(p => indexes.indexOf(p.id) === -1));
    setSelected({...selected, indexes: []});
  };

  const filteredPeople = useMemo(() => filterPeople(filter, people), [filter, people]);
  const indexes = useMemo(() => filterIndexes(filteredPeople, selected.indexes), [filteredPeople, selected.indexes]);

  return (
    <div>
      <h2>CRUD - List of People</h2>

      <form>
        <div class="form-group">
          <label for="filter">Filter</label>
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Filter list"
              id="filter"
              value={filter}
              onChange={event => setFilter(event.target.value)}
              aria-label="Filter" aria-describedby="filter" />
            <div class="input-group-append" id="clear">
              <button class="btn btn-outline-secondary" type="button"
                onClick={() => setFilter('')}
                >Clear</button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div className="form-group">
              <label htmlFor="people">People</label>
              <select
                className="form-control"
                id="people"
                multiple={true}
                style={{ minHeight: '124px' }}
                value={indexes}
                onChange={({ target }) =>
                  setIndexes([...target.options].filter(o => o.selected).map(o => o.value))}>
                {filteredPeople.map(function({ id, firstname, lastname }) {
                  return (
                    <option key={id} value={id}>
                      {lastname && firstname ? `${lastname}, ${firstname}` : firstname || lastname}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div class="col">
            <div className="form-group">
              <label htmlFor="fname">First Name</label>
              <input
                className="form-control"
                id="fname"
                type="text"
                value={selected.firstname || ''}
                onChange={event => setSelected({...selected, firstname: event.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lname">Last Name</label>
              <input
                className="form-control"
                id="lname"
                type="text"
                value={selected.lastname || ''}
                onChange={event => setSelected({...selected, lastname: event.target.value })}
              />
            </div>
          </div>
        </div>

        <button
          className="btn btn-light"
          onClick={create}
          disabled={!valid(selected.firstname, selected.lastname)}>
          Create
        </button>{' '}
        <button
          className="btn btn-light"
          onClick={() => update(indexes[0])}
          disabled={indexes.length !== 1}>
          Update
        </button>{' '}
        <button
          className="btn btn-danger"
          onClick={() => remove(indexes)}
          disabled={indexes.length === 0}>
          Delete
        </button>
      </form>
    </div>
  );
}

export default CRUD;
