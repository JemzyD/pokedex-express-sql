const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const pg = require('pg');
const file =  'pokedex.json';


// Initialise postgres client
const configs = {
  user: 'jemimalim',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};

const pool = new pg.Pool(configs);


pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Routes
 * ===================================
 */


// HOME PAGE
app.get('/', (req, response) => {
  // query database for all pokemon

  // respond with HTML page displaying all pokemon
  //
  const queryString = 'SELECT * from pokemon'

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('query error:', err.stack);
    } else {
      console.log('query result:', result);
      if (req.query.sortby === 'name') {
          result.rows.sort(function(a, b) {
            return ( a.name.toLowerCase() < b.name.toLowerCase() ) ? -1 : ( a.name.toLowerCase() > b.name.toLowerCase() ) ? 1 : 0;
          })
      } else {
          result.rows.sort(function(a, b) {
            return ( parseInt(a.id) < parseInt(b.id) ) ? -1 : ( parseInt(a.id) > parseInt(b.id) ) ? 1 : 0;
          })
      }

      response.render('home', {pokemon : result.rows});

      // redirect to home page
      // response.send( result.rows );
    }
  });

});


// CREATE NEW POKEMON
app.get('/new', (req, response) => {
  const pokeNum = 'SELECT id FROM pokemon WHERE id = (SELECT MAX(id) FROM pokemon)'

  pool.query(pokeNum, (err, res) => {
    if (err) {
      console.log('ERROR BITCH', err);
    } else {
      let num = parseInt(res.rows[0].id) + 1
        // respond with HTML page with form to create new pokemon
      response.render('new', {pokeNum : num});
    }
  })
});


// INFO FOR NEW POKE
app.post('/pokemon', (req, response) => {
  let params = req.body;

  const queryString = 'INSERT INTO pokemon(id, num, name, img, height, weight) VALUES($1, $2, $3, $4, $5, $6)'
  const values = [params.id, params.num, params.name, params.img, params.height, params.weight];

  pool.query(queryString, values, (err, res) => {
    if (err) {
      console.log('query error:', err.stack);
    } else {
      console.log('query result:', res);

      response.redirect('/');
    }
  });
});

// EDIT PAGE

app.get('/pokemon/:id/edit', (req, response) =>  {
  let input = req.params.id;
  const queryString = 'SELECT * FROM pokemon WHERE id = $1';
  const value = [input];

  pool.query(queryString, value, (err, result) => {
    if (err) {
        console.log('query error: ', err.stack);
    } else {
        console.log('query result: ', result);
        response.render('edit', {pokemon: result.rows[0]});
    }
  })
});

// GET THAT ID OUT
app.get('/pokemon/:id', (req, response) => {
  let input = req.params.id;
  const queryString = 'SELECT * FROM pokemon WHERE id = $1';
  const value = [input];

  pool.query(queryString, value, (err, result) => {
    if (err) {
        console.log('query error: ', err.stack);
    } else {
        console.log('query result: ', result);
        response.render('pokemon', {pokemon: result.rows[0]});
    }
  })
});

// DELETE STUFF
app.get('/:id/del', (req, response) => {
  let input = req.params.id;
  const queryString = 'SELECT * FROM pokemon WHERE id = $1';
  const value = [input];

  pool.query(queryString, value, (err, result) => {
    if (err) {
      console.log('query error: ', err.stack);
    } else {
      console.log('query result: ', result);
      response.render('delete', {pokemon : result.rows[0]});
    }
  })
});

app.delete('/pokemon/:id/', (req, response) => {
  let input = req.params.id;
  const queryString = 'DELETE FROM pokemon WHERE id = $1';
  const value = [input];

  pool.query(queryString, value, (err, result) => {
    if (err) {
      console.log('query error: ', err.stack);
    } else {
      console.log('query result: ', result);
      response.redirect('/');
    }
  })
});



/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));





