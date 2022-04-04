import { GET_POKEMON, SAVE_POKEMON, ERROR_GET_POKEMON, NO_ACTION_REQUIRED, SAVE_TOP_POKEMON_TYPES } from "../constants";

export const initialState = {
  loading: false,
  error: false,
  status: '',
  pokemon: [],
  top3: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case NO_ACTION_REQUIRED: {
      return {
        ...state,
        loading: false,
        error: false,
        status: action.payload ?? '',
      }
    }
    case GET_POKEMON: {
      return {
        ...state,
        loading: true,
        error: false,
        status: '',
      }
    }
    case ERROR_GET_POKEMON: {
      return {
        ...state,
        loading: false,
        error: true,
        status: action.payload ?? '',
      }
    }
    case SAVE_POKEMON: {
      return {
        ...state,
        loading: false,
        error: false,
        pokemon: state.pokemon.concat([action.payload?.pokemon]),
        status: action.payload?.status ?? '',
      }
    }
    case SAVE_TOP_POKEMON_TYPES: {
      return {
        ...state,
        loading: false,
        error: false,
        top3: action.payload ?? [],
        status: '',
      }
    }
    default: {
      return state;
    }
  }
}

export default reducer;