


/*
    1. Configuración inicial
    obtener las credenciales y la URL base de la API de Radarr.
*/
const axios = require('axios');
const { buscarIdPelicula } = require('./scrip_auto_TMDB.js'); 
 
const RADARR_API_KEY = '93e61390fa3d46ac80d2df265af7d9a9'; // credenciales de Radarr
const RADARR_URL = 'http://localhost:7878/api/v3'; // Cambiar por la URL de tu servidor Radarr
const QUALITY_PROFILE_ID = 1; // ID del perfil de calidad que deseas usar
const ROOT_FOLDER_PATH = '/home/aleaguilar/Descargas/'; // Ruta de la carpeta config



/*
    2. Función para enviar información a Radarr
*/
async function addMovieToRadarr(title, tmdbCurrent, qualityProfileId, rootFolderPath) {
    try {
        // Construir el objeto de datos para la película
        const movieData = {
            title: title,
            qualityProfileId: qualityProfileId,
            rootFolderPath: rootFolderPath,
            tmdbId: tmdbCurrent,
            addOptions: {
                searchForMovie: true
            }
        };


        // Realizar la petición POST para agregar la película
        const response = await axios.post(`${RADARR_URL}/movie`, movieData, {
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': RADARR_API_KEY
            }
        });

        console.log('Película agregada a Radarr:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al agregar la película:', error.response.data);
        throw error;
    }
}


/*
    3. Función para configurar la descarga en Radarr
*/
async function configureDownload(movieId, qualityProfileId, carpeta) {
    try {
        // Construir el objeto de datos para configurar la descarga
        const movieData = {
            qualityProfileId: qualityProfileId,
            path: carpeta
        };

        // Realizar la petición PUT para configurar la descarga
        const response = await axios.put(`${RADARR_URL}/movie/${movieId}`, movieData, {
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': RADARR_API_KEY
            }
        });

        console.log('Configuración de descarga actualizada en Radarr:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al configurar la descarga:', error.response.data);
        throw error;
    }
}

/*
    4. Monitorear el progreso y manejar errores
*/
async function monitorProgress(movieId) {
    try {
        let movieStatus = 'pending'; // Estado inicial

        while (movieStatus !== 'released') {

            const response = await axios.get(`${RADARR_URL}/movie/${movieId}`, {
                headers: {
                    'X-Api-Key': RADARR_API_KEY
                }
            });

            console.log(response.data.status);

            movieStatus = response.data.status; 

            if (movieStatus === 'pending') {
                console.log('La película aún está pendiente de descarga en Radarr...');
                await delay(30000); // Esperar 30 segundos antes de consultar de nuevo
            } else if (movieStatus === 'released') {
                console.log('La película ha sido descargada y está lista en Radarr.');
                break;
            } else {
                console.log('Estado desconocido:', movieStatus);
                break;
            }
        }
    } catch (error) {

        console.error('Error al monitorear el progreso:', error.response.data);
        throw error;
    }
}

// Función auxiliar para pausar el código
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(title, carpeta) {

    const tmdbId = await buscarIdPelicula(title);


    if (typeof tmdbId !== 'number') {
        console.error(tmdbId);
        return;
    }

    try {
        // Agregar la película a Radarr
        const addedMovie = await addMovieToRadarr(title, tmdbId, QUALITY_PROFILE_ID, ROOT_FOLDER_PATH);

        // Configurar la descarga en Radarr
        await configureDownload(addedMovie.id, QUALITY_PROFILE_ID, carpeta);
        
        // Monitorear el progreso
        await monitorProgress(addedMovie.id);

    } catch (error) {
        console.error('Ocurrió un error en el proceso:', error);
    }
}

module.exports = {
    main
};