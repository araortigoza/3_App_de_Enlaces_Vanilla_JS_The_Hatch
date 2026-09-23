const API_URL = 'http://localhost:4000/api';

// FUNCION PARA PETICION DE FILTRADO DE TAGS
async function getLinks(tag) {
  const url = tag ? `${API_URL}/links?tag=${tag}` : `${API_URL}/links`; // SE PREPARA LA URL PARA LA CONSULTA
  const respuesta = await fetch(url); // SE REALIZA LA CONSULTA AL BACKEND CON LA RUTA CORRESPONDIENTE
  return respuesta.json(); // SE RETORNA LOS LINKS CON EL TAG CORRESPONDIENTE
}

// FUNCION PARA PETICION DE LINK POR ID
async function getLinkById(id) {
  const respuesta = await fetch(`${API_URL}/links/${id}`); // SE REALIZA LA CONSULTA AL BACKEND CON LA RUTA CORRESPONDIENTE
  return respuesta.json(); // SE RETORNA LA RESPUESTA
}

// FUNCION PARA CREAR UN LINK
async function createLink(datos) {
  // RECIBE EL ENLACE Y ENVIA LA PETICION A LA RUTA CORRESPONDIENTE
  const respuesta = await fetch(`${API_URL}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos) // CONVIERTE A JSON EL OBJETO QUE CONTIENE LOS DATOS DEL NUEVO LINK
  });
  return respuesta.json(); // SE RETORNA LA RESPUESTA
}

// FUNCION PARA VOTAR POR UN LINK
async function voteLink(id) {
  // RECIBE EL ENLACE Y ENVIA LA PETICION A LA RUTA CORRESPONDIENTE
  const respuesta = await fetch(`${API_URL}/links/${id}/vote`, {
    method: 'POST'
  });
  return respuesta.json(); // SE RETORNA LA RESPUESTA
}

async function getComments(id) {
  // RECIBE EL ENLACE Y ENVIA LA PETICION A LA RUTA CORRESPONDIENTE
  const respuesta = await fetch(`${API_URL}/links/${id}/comments`);
  return respuesta.json(); // SE RETORNA LA RESPUESTA
}

async function createComment(id, datos) {
  // RECIBE EL ENLACE Y ENVIA LA PETICION A LA RUTA CORRESPONDIENTE
  const respuesta = await fetch(`${API_URL}/links/${id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return respuesta.json(); // SE RETORNA LA RESPUESTA
}