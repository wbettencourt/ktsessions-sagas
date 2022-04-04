import { GET_POKEMON, SAVE_POKEMON, ERROR_GET_POKEMON, NO_ACTION_REQUIRED, GET_POKEMON_TYPE, SAVE_TOP_POKEMON_TYPES } from "../constants"

export const noActionRequired = (payload) => ({ type: NO_ACTION_REQUIRED, payload });

export const getPokemon = (payload) => ({ type: GET_POKEMON, payload });

export const savePokemon = (pokemon, status) => ({ type: SAVE_POKEMON, payload: { pokemon, status } });

export const errorGetPokemon = (payload) => ({ type: ERROR_GET_POKEMON, payload });

export const getPokemonType = (payload) => ({ type: GET_POKEMON_TYPE, payload });

export const savePokemonType = (payload) => ({ type: SAVE_TOP_POKEMON_TYPES, payload });