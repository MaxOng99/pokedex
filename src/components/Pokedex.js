import React, { useEffect, useState } from "react";

import { fetchPokemon } from "../apis/pokemon_api";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { ErrorBoundary } from '../ErrorBoundary';

/** COMPONENTS */
const Pokedex = () => {

    const [pokemonInfo, setPokemonInfo] = useState({});    
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [requestError, setRequestError] = useState(false);

    useEffect(async () => {
        setLoadingStatus(true);
        const pokemon = await fetchPokemon("pikachu");
        setPokemonInfo(pokemon);
    }, []);

    async function onSubmit(e) {
        e.preventDefault();
        setLoadingStatus(true);
        setPokemonInfo({});
        const formData = new FormData(e.target);
        const pokemonName = formData.get("pokemonName");
        try {
            const relevantInfo = await fetchPokemon(pokemonName.toLowerCase().replace(/\s/g, ''));
            setPokemonInfo(
                relevantInfo
            );
            setRequestError(false);
        }
        catch{
            setRequestError(true)
        }
    }

    return(
        <>  
            <h2>Search a Pokemon!</h2>
            
            <SearchBar onSubmit={onSubmit}/>
            <SkeletonTheme duration={0.8} baseColor="whitesmoke" highlightColor="#ececec">
                <ErrorBoundary key={requestError ? 1 : 0}>
                        <PokemonInfo>
                            <Header error={requestError} name={pokemonInfo.name}
                                loadingStatus={loadingStatus}
                                img={<PokemonImage loadingStatus={loadingStatus }src={pokemonInfo?.sprite} setLoadingStatus={setLoadingStatus}/>}/>
                            <DataContent loadingStatus={loadingStatus} data={pokemonInfo}/>
                        </PokemonInfo>
                </ErrorBoundary>    
            </SkeletonTheme>
        </>
    );    
};

const SearchBar = ({ onSubmit }) => {
    return(
        <form onSubmit={(e) => onSubmit(e)}>
            <input id="search-input" name="pokemonName" type="text" placeholder="Pikachu"/>
            <button type="submit">Search</button>
        </form>
    );
};

const Header = ({ error, name, img, loadingStatus }) => {
    if (error) {
        throw error
    }
    else{
        return(
            <header>
                <h2>{loadingStatus ? "Fetching Pokemon Data..." : name.toUpperCase()}</h2>
                {img}
            </header>
        );
    }
};

const PokemonImage = ({ loadingStatus, src, setLoadingStatus} ) => {
    return(
        <>
            <img id={`image-loading-${loadingStatus}`} src={src} onLoad={() => setLoadingStatus(false)}></img>
            <Skeleton width={240} height={240} style={{ display: loadingStatus ? "block" : "none"}}/>
        </>
    );
}

const PokemonInfo = ({ children }) => {
    return(
        <article>
            {children}
        </article>
    );
}

const DataContent = ( { data, loadingStatus } ) => {

    return(
        <section id="data-content">
            {
                loadingStatus
                ? <Skeleton width={650} height={20} count={3}/>
                : <ul>
                    <li>
                        <p className="data-key">Height</p>
                        <p className="data-value">{`${data.height} M`}</p>
                    </li>
                    <li>
                        <p className="data-key">Weight</p>
                        <p className="data-value">{`${data.weight} KG`}</p>
                    </li>
                    <li>
                        <p className="data-key">Ability</p>
                        <p className="data-value">{`${data.ability}`}</p>
                    </li>
                    <li>
                        <p className="data-key">Type</p>
                        {
                            <p className="type-data-value">
                                {data?.types?.map(type => <span key={type} className={`${type}-type type-element`}>{type}</span>)}
                            </p>
                        }
                    </li>
                </ul>
            }
        </section>
    );
}

export default Pokedex;