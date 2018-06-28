var React = require("react");

class Home extends React.Component {
  render() {
    return (
      <html>
        <head />
        <body>
         <form action="/" method="get">
            <button type="submit" name="sortby" value="name">Sort By Name</button>
            <button type="submit" name="sortby" value="id">Sort By ID</button>
        </form>
          <h1>Pokedex YASSSSSS!</h1>
          <a href="/new">Create a Pokemon</a>
          <ul>
            {this.props.pokemon.map(pokemon => (
              <div key={pokemon.id}>
              <p><img src={pokemon.img}/></p>
              <a href={'/pokemon/' + pokemon.num}>{pokemon.name}</a>
              <p>Id : {pokemon.id}</p>
              <p>Num : {pokemon.num}</p>
              <p>Height : {pokemon.height}</p>
              <p>Weight : {pokemon.weight}</p>
              </div>
            ))}
          </ul>
        </body>
      </html>
    );
  }
}

module.exports = Home;