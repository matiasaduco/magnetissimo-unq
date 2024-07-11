const { main } = require('./script_de_automizacion.js'); 

main("Superman").catch(error => {
    console.error('Ocurrió un error en el proceso:', error);
});