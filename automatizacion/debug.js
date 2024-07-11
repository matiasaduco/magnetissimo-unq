
// Ejemplo de Modificacion para la función debug, para almacenar los mensajes en localStorage
export let debug = (view, kind, msg, obj) => {
  if (view.liveSocket.isDebugEnabled()) {
    let message = `${view.id} ${kind}: ${msg} - `;
  if (obj) {
    message += JSON.stringify(obj);
  }
    
    // Guardar el mensaje en localStorage
    let debugMessages = JSON.parse(localStorage.getItem('debugMessages')) || [];
    debugMessages.push(message);
    localStorage.setItem('debugMessages', JSON.stringify(debugMessages));
  }
}
  
  // Ejemplo de cómo podríamos utilizar los mensajes de debug almacenados
  // Esta función podría estar vinculada a un botón en tu interfaz
export function mostrarMensajesDebug() {
  // Obtener mensajes almacenados en localStorage  
  let debugMessages = JSON.parse(localStorage.getItem('debugMessages')) || [];
  console.log("Mensajes de debug almacenados:");
  console.log(debugMessages);
  // el debugMessages tiene toda la informacion completa, para nosotros nos interesa
  // solo el obj, pero es buena practica guardar la info completa

  // falta meter logica para utilizar el obj
  // una idea es el boton
}
