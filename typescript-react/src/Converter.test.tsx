import React from 'react';
import ReactDOM from 'react-dom';
import { isNumeric } from './Converter';

it('string is number', () => {
  expect(isNumeric("10")).toEqual(true);
});

it('string is not  number', () => {
  expect(isNumeric("aaa")).toEqual(false);
});

it('object not number', () => {
  expect(isNumeric({})).toEqual(false);
});
