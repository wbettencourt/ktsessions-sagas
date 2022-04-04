// import { render, screen } from '@testing-library/react';
import { call, put, select } from 'redux-saga/effects';
import { runSaga } from 'redux-saga';

import { GET_POKEMON } from './constants';
import { savePokemon, noActionRequired, errorGetPokemon, savePokemonType } from './actions';
import { getAllPokemon } from './selectors';
import { fetchPokemon, getSinglePokemon, getPokemonTypes } from './sagas';

import { getPokemonByNameOrId, getPokemonByType } from './utils';

jest.mock('./utils');

jest.mock('./selectors');

describe('Saga testing examples', () => {
  describe('testing saga step by step', () => {
    it('searching for an existing pokemon', () => {
      const action = { type: GET_POKEMON, payload: 'pikachu' };
      const gen = fetchPokemon(action);
  
      expect(gen.next().value).toEqual(call(getPokemonByNameOrId, action.payload)); // 
      
      const responseFromPokemonByNameOrId = { data: { id: '1', name: 'pikachu' } };
      
      expect(gen.next(responseFromPokemonByNameOrId).value).toEqual(select(getAllPokemon));
  
      const selectAllPokemonResult = [ responseFromPokemonByNameOrId.data ];
  
      expect(gen.next(selectAllPokemonResult).value).toEqual(put(noActionRequired('You already catched that pokemon!')));
  
    });
    it('searching for a new pokemon', () => {
      const action = { type: GET_POKEMON, payload: 'pikachu' };
      const gen = fetchPokemon(action);
  
      expect(gen.next().value).toEqual(call(getPokemonByNameOrId, action.payload));
      
      const responseFromPokemonByNameOrId = { data: { id: '1', name: 'pikachu' } };
      
      expect(gen.next(responseFromPokemonByNameOrId).value).toEqual(select(getAllPokemon));
  
      const selectAllPokemonResult = [];
  
      expect(gen.next(selectAllPokemonResult).value).toEqual(put(savePokemon(responseFromPokemonByNameOrId.data)));
    });
  });

  
});
describe('testing saga as a whole', () => {

  describe('fetchPokemon', () => {
    it('fetch a new pokemon', async () => {
      getPokemonByNameOrId.mockImplementation(() => ({ data: { id: '1', name: 'pikachu' } }));
      getAllPokemon.mockImplementation(() => []);
      const action = { type: GET_POKEMON, payload: 'pikachu' };
      const record = await recordSaga(fetchPokemon, action);
  
      expect(record.dispatched).toContainEqual(savePokemon({ id: '1', name: 'pikachu' }));
    });
    it('fetch an existing pokemon', async () => {
      getPokemonByNameOrId.mockImplementation(() => ({ data: { id: '1', name: 'pikachu' } }));
      getAllPokemon.mockImplementation(() => [{ id: '1', name: 'pikachu' }]);
      const action = { type: GET_POKEMON, payload: 'pikachu' };
      const record = await recordSaga(fetchPokemon, action);
  
      expect(record.dispatched).toContainEqual(noActionRequired('You already catched that pokemon!'));
    });
  
    it('fetch an unknown pokemon', async () => {
      getPokemonByNameOrId.mockImplementation(() => Promise.reject('Some error'));
      const action = { type: GET_POKEMON, payload: 'pikachu' };
      const record = await recordSaga(fetchPokemon, action);
  
      expect(record.dispatched).toContainEqual(errorGetPokemon('Pokemon not found, are you sure it isnt a figment of your imagination?'));
    });
  });
  describe('getSinglePokemon', () => {
    it('should fetch a single pokemon', async () => {
      const expected = { data: { sprites: { front_default: 'front.jpg' } } };
      getPokemonByNameOrId.mockImplementation(() => expected);
      
      const params = { name: 'pikachu' };
      const record = await recordSaga(getSinglePokemon, params);
      expect(getPokemonByNameOrId).toHaveBeenCalledTimes(1);
      expect(record.result).toEqual({ data: expected.data.sprites.front_default, error: false });
    });
    it('should return an error object on failure', async () => {
      getPokemonByNameOrId.mockImplementation(() => Promise.reject(':('));
      
      const record = await recordSaga(getSinglePokemon, { name: 'pikachu' });

      expect(getPokemonByNameOrId).toHaveBeenCalledTimes(1);
      expect(record.result).toEqual({ data: null, error: true });
    });
  });

  describe('getPokemonTypes', () => {
    it('should get the top 3 pokemon of given type', async () => {
      getPokemonByType.mockImplementation(() => ({ data: { pokemon: [{ pokemon: { name: 'pikachu' }}, { pokemon: { name: 'snorlax' }}, { pokemon: { name: 'clefairy' }}]}}));
      getPokemonByNameOrId.mockImplementation((pkn) => ({ data: { sprites: { front_default: `${pkn}.png` } } }));

      const record = await recordSaga(getPokemonTypes, { payload: 'ground' });

      expect(getPokemonByType).toHaveBeenCalledTimes(1);
      expect(getPokemonByNameOrId).toHaveBeenCalledTimes(3);
      
      expect(record.dispatched).toContainEqual(savePokemonType(['pikachu.png', 'snorlax.png', 'clefairy.png']));
    });
  });
});

async function recordSaga(saga, ...args) {
  const dispatched = [];

  const task = await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
      getState: () => {},
    },
    saga,
    ...args,
  );

  return { result: task.result(), dispatched };
}

