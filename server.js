const express = require('express');
const request = require('request');
const port = process.env.PORT || 8000;
const pokeAPI = "https://pokeapi.co/api/v2/pokemon/";

const app = express();

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

    const body = `
    <div>
    <img src="${pokemon.sprites.front_default}">
        <ul>Stats
            <li>Name: ${pn(pokemon.name)}</li>
            <li>Height: ${pokemon.height}</li>
            <li>Weight: ${pokemon.weight}</li>
        </ul>
    </div>
    `;
    res.send(body);
});

app.listen(port, function (err) {
    if (err) {
        console.error("Error starting the server: ", err);
    }
    console.log(`Server is running at port ${port}`);
});

/*
request(pokeAPI, function (err, res, body) {
    console.log('err: ', err);
    console.log('res: ', res);
    console.log('body: ', body);
});
*/