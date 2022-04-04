import axios from 'axios';

export const getPokemonByNameOrId = (nameOrId) => axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}/`);

export const getPokemonByType = (pokemonType) => axios.get(`https://pokeapi.co/api/v2/type/${pokemonType}/`);
