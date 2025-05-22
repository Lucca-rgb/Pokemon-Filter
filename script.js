ocument.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('load-pokemon');
  const container = document.getElementById('pokemon-container');
  const filterSelect = document.getElementById('pokemon-filter');
  let pokemonList = [];

  // Função para formatar a descrição
  const formatDescription = (text) => {
    let formatted = text.toLowerCase().replace(/\f/g, ' ');
    formatted = formatted.replace(/pokémon/g, 'Pokémon');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  // Função para carregar o Pokémon
  const loadPokemon = async (id) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!response.ok) {
        throw new Error(`Error searching Pokémon with ID ${id}`);
      }
      const data = await response.json();

      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
      if (!speciesResponse.ok) {
        throw new Error(`Error searching Pokémon species with ID ${id}`);
      }
      const speciesData = await speciesResponse.json();

      const flavor = speciesData.flavor_text_entries.find(entry => entry.language.name === 'pt') ||
                     speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');

      container.innerHTML = `
        <div class="col-md-6 pokemon-card">
          <img src="${data.sprites.front_default}" class="pokemon-img" alt="${data.name}" />
          <h3>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h3>
          <p class="description">${flavor ? formatDescription(flavor.flavor_text) : 'No description available.'}</p>
        </div>
      `;
    } catch (error) {
      console.error('Error loading Pokémon:', error);
      container.innerHTML = '<p class="text-danger">Error loading the Pokémon. Try again!</p>';
    }
  };

  // Carregar lista de Pokémons para o filtro
  const loadPokemonList = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
      const data = await response.json();
      pokemonList = data.results;

      pokemonList.forEach(pokemon => {
        const option = document.createElement('option');
        option.value = pokemon.name;
        option.innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        filterSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error loading the Pokémon list:', error);
    }
  };

  // Evento do botão
  button.addEventListener('click', () => {
    const selectedPokemonName = filterSelect.value;

    if (!selectedPokemonName) {
      container.innerHTML = '<p class="text-warning">No Pokémon to filter!</p>';
      return;
    }

    const selectedPokemon = pokemonList.find(p => p.name === selectedPokemonName);

    if (selectedPokemon) {
      const pokemonId = selectedPokemon.url.split('/')[6];
      loadPokemon(pokemonId);
    }
  });

  // Inicialização
  loadPokemonList();
});
