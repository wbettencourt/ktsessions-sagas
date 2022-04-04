import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getPokemon, getPokemonType } from '../../actions';
import { getAllPokemon, isApiLoading, appStatus, getTopPokemonTypes } from '../../selectors';

export default function Pokedex() {
  const dispatch = useDispatch();
  const allPokemon = useSelector(getAllPokemon);
  const topPokemon = useSelector(getTopPokemonTypes);
  const isLoading = useSelector(isApiLoading);
  const status = useSelector(appStatus);

  const [ search, setSearch ] = useState('');

  const updateSearch = (e) => {
    setSearch(e.target.value);
  }

  const lookup = () => {
    dispatch(getPokemon(search));
    setSearch('');
  }
  const lookupType = () => {
    dispatch(getPokemonType(search));
    setSearch('');
  }

  useEffect(() => {
    dispatch(getPokemon('pikachu'));
  }, [dispatch]);

  return (
    <div>
      Hello World!
      <div className="searchthing">
        <input type="text" value={search} onChange={updateSearch}/>
        <div>
          <button type="button" onClick={lookup}>Search this Pokemon!</button>
          <button type="button" onClick={lookupType}>Search this Pokemon Type!</button>
        </div>
        {isLoading ? <span>Loading...</span> : null}
        {status}
      </div>
      <hr />
      <div>
        <div>
          {topPokemon.map((sprite, index) => (
            <img key={index} src={sprite} alt="" />
          ))}
        </div>
        <div className="pokelist">
          {allPokemon.map((pkn) => (
            <div key={pkn.id} className="pokemon">
              <h2>{pkn.name}</h2>
              <img src={pkn.sprites.front_default} alt={pkn.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}