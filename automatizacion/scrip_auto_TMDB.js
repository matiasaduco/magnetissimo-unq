
// Definicion de API Key de TMDB
const apiKey = '40b4c08643cdd4e5521f64fcf6652aa8';

// Usuario : Alejandro98
// contraseña : Alejandro98A.


// Función para buscar el ID de una película por su título
async function buscarIdPelicula(titulo) {

    // URL base de la API de TMDB para búsqueda de películas
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(titulo)}`;
    
    try {
        // Realizamos la petición HTTP GET a TMDB
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al buscar la película');
        }
        const data = await response.json();
        
        // Obtener el ID de la primera película encontrada (suponiendo que sea la más relevante)
        if (data.results && data.results.length > 0) {
            const idPelicula = data.results[0].id;
            console.log(`El ID de "${titulo}" es: ${idPelicula}`);
            return idPelicula;
        } else {
            throw new Error('No se encontró la película');
        }
    } catch (error) {
        console.error('Error al buscar la película:', error.message);
    }
}

module.exports = {
    buscarIdPelicula
};