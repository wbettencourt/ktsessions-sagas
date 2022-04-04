import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import { GET_POKEMON, GET_POKEMON_TYPE } from '../constants';

import { savePokemon, noActionRequired, errorGetPokemon, savePokemonType } from '../actions';

import { getAllPokemon } from '../selectors';

import {
  getPokemonByNameOrId,
  getPokemonByType,
} from '../utils';

const doStuff = (cosos, id) => cosos.find((x) => x.id === id);

export function* fetchPokemon(action) {
  try {
    const response = yield call(getPokemonByNameOrId, action.payload);

    const allPokemon = yield select(getAllPokemon);

    const pokemon = response.data;

    // const pokemonAlreadyAdded = allPokemon.find((pk) => pk.id === pokemon.id);
    const pokemonAlreadyAdded = yield call(doStuff, allPokemon, pokemon.id);

    if (!pokemonAlreadyAdded) {
      yield put(savePokemon(response.data));
    } else {
      yield put(noActionRequired('You already catched that pokemon!'));
    }
  } catch (error) {
    yield put(errorGetPokemon('Pokemon not found, are you sure it isnt a figment of your imagination?'));
  }
}

export function* getPokemonTypes(action) {
  try {
    const response = yield call(getPokemonByType, action.payload);
    const top3PokemonOfType = response.data.pokemon.slice(0, 3);

    const responses = yield all(top3PokemonOfType.map((pkn) => call(getSinglePokemon, pkn.pokemon)));

    const poks = responses.filter((resp) => !resp.error).map((pok) => pok.data);
    yield put(savePokemonType(poks));
  } catch (error) {
    yield put(errorGetPokemon('Pokemon type not found, is there a typo?'));
  }
}

export function* getSinglePokemon(pokemon) {
  if (!pokemon.name) return;
  try {
    const response = yield call(getPokemonByNameOrId, pokemon.name);
    return { data: response.data.sprites.front_default, error: false };
  } catch (error) {
    return { data: null, error: true };
  }
}

export default function* mainSaga() {
  yield takeLatest(GET_POKEMON, fetchPokemon);
  yield takeLatest(GET_POKEMON_TYPE, getPokemonTypes);
}