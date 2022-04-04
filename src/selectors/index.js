// import { createSelector } from 'reselect';

export const getAllPokemon = (state) => state.pokemon;

export const getTopPokemonTypes = (state) => state.top3 ?? [];

export const isApiLoading = (state) => state.loading;

export const hasError = (state) => state.error;

export const appStatus = (state) => state.status;
