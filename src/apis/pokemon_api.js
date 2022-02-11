/** Vendor API */
const POKEDEX_API = "https://pokeapi.co/api/v2/pokemon";

/** Custom API */
async function fetchPokemon(name) {
    const response = await fetch(`${POKEDEX_API}/${name}`);
    const pokemonObject = await response.json();
    return extractRequiredInfo(pokemonObject);
}
/** Helper Functions */
function extractRequiredInfo(pokemonObject) {
    return(
        {   
            id: pokemonObject.id,
            name: pokemonObject.name,
            ability: pokemonObject.abilities[0].ability.name,
            sprite: pokemonObject.sprites.other['official-artwork'].front_default,
            types: pokemonObject.types.map(type => type.type.name),
            height: (pokemonObject.height * 0.1).toFixed(2),
            weight: (pokemonObject.weight * 0.1).toFixed(2)
        }
    );
}

export { fetchPokemon }