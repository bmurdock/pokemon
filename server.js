const express = require('express');
const request = require('request');
const port = process.env.PORT || 8000;
const pokeAPI = "https://pokeapi.co/api/v2/pokemon/";

const app = express();
app.use(express.static('public'));

let pokemon;
function getPokemon(req, res, next) {
    const pokemonId = Math.floor(Math.random() * 900) + 1;
    const options = {
        url: `${pokeAPI}${pokemonId}`
    };
    request(options, function (err, res, body) {
        if (err) {
            console.error('Request got an error: ', err);
            return next();
        }
        if (res.statusCode !== 200) {
            console.log(`Attempted to get Pokemon #${pokemonId}`);
            console.error(`Request was not successful ${res.body}`);
            return next();
        }
        pokemon = JSON.parse(body);
        console.log(`Setting global pokemon to ${pokemon.name}`);
        next();
    });
}

app.use(getPokemon);
function pn(str) {
    return str[0].toUpperCase() + str.slice(1);
}

app.get('/', function (req, res) {
    if (typeof pokemon.name !== 'string' || pokemon.name === '') {
        res.send('Invalid Pokemon');
        return;
    }
    if (pokemon.types.length > 1) {
        pokemon.types.sort((a, b) => {
            return parseInt(a.type.slot) - parseInt(b.type.slot);
        });
    }

    const types = pokemon.types.map((type) => {
        return type.type.name;
    });
    let typeBlobs = '';
    for (const type of types) {
        typeBlobs += `<span class="${type}">${type}</span>`
    }

    const body = `
    <link rel="stylesheet" href="/css/base.css">
    <section class="container">
        <div class="card ${types[0]}">
            <div class="overlay">
                <h4>${pn(pokemon.name)}</h4>
                <div class="imagePane">
                    <img src="${pokemon.sprites.front_default}">
                </div>
                <h5>Types</h5>
                <div class="pokeTypes">
                    ${typeBlobs}
                </div>
                <ul>Stats
                    <li>Height: ${pokemon.height}</li>
                    <li>Weight: ${pokemon.weight}</li>
                </ul>
            </div>
        </div>
    
        <button onclick="window.location.reload()">Refresh</button>

    </section>
    `;
    res.send(body);
});

app.listen(port, function (err) {
    if (err) {
        console.error("Error starting the server: ", err);
    }
    console.log(`Server is running at port ${port}`);
});