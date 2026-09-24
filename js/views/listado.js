// FUNCION PRINCIPAL PARA RENDERIZAR EL LISTADO DE LINKS
async function renderListado(tagActivo) {
  const contenedor = document.getElementById('app'); // SELECCIONA EL ELEMENTO <main id="app"></main> DEL HTML
  contenedor.innerHTML = '<p>Cargando enlaces...</p>'; // MUESTRA UNA PANTALLA DE CARGA

  const todosLosLinks = await getLinks(); // SE LLAMA A LA FUNCION QUE TRAE TODOS LOS LINKS
  const tagsUnicos = [...new Set(todosLosLinks.flatMap(link => link.tags))]; // SE BUSCA EL TAG DE CADA ENLACE, LOS AGREGA A UN NUEVO ARREGLO Y CON SET SE ELIMINAN DUPLICADOS Y SE CREA NUEVAMENTE UN ARREGLO CON TAGS UNICOS
  const links = (tagActivo ? todosLosLinks.filter(link => link.tags.includes(tagActivo)) : todosLosLinks) // FILTRA POR EL TAG ACTIVO EN CASO DE TENER UN VALOR LOS ENLACES QUE TENGAN ESE TAG
    .sort((a, b) => b.votes - a.votes); // ORDENA LOS ENLACES DE MAYOR A MENOS SEGUN LOS VOTOS

  // INYECCION DE HTML DINAMICO
  contenedor.innerHTML =
   `
    <section class="formulario">
      <h2>Agregar enlace</h2>
      <form id="form-nuevo-link">
        <input type="text" id="input-title" placeholder="Titulo" required>
        <input type="url" id="input-url" placeholder="Link: https://..." required>
        <input type="text" id="input-tags" placeholder="Nombre de Etiqueta" maxlength="100">
        <button type="submit">Guardar</button>
      </form>
    </section>

    <section class="filtros">
      <button data-tag="" class="tag-btn ${!tagActivo ? 'activo' : ''}">Todos</button>
      ${tagsUnicos.map(tag => `
        <button data-tag="${tag}" class="tag-btn ${tag === tagActivo ? 'activo' : ''}">${tag}</button>
      `).join('')}
    </section>

    <section class="lista-links">
      ${links.length === 0 ? '<p>No hay enlaces todavia.</p>' : links.map(link => `
        <article class="tarjeta-link" data-id="${link._id}">
          <h3>${link.title}</h3>
          <p class="url">${link.url}</p>
          <div class="tags">${link.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          <p class="votos">▲ ${link.votes} votos</p>
        </article>
      `).join('')}
    </section>
  `;

  // SE PONE EN ESCUCHA EN EL FORMULARIO, ANTE CUALQUIER EVENTO SUBMIT SE ACTIVA
  contenedor.querySelector('#form-nuevo-link').addEventListener('submit', async (evento) => {
    evento.preventDefault(); // FRENA EL RECARGADO DE LA PAGINA
    // OBTIENE EL TEXTO CRUDO (.VALUE) ESCRITO POR EL USUARIO
    const title = document.getElementById('input-title').value;
    const url = document.getElementById('input-url').value;
    const tags = document.getElementById('input-tags').value
      .split(',') // SEPARA LAS PALABRAS POR COMAS Y CREA UN ARREGLO
      .map(t => t.trim()) // QUITA LOS ESPACIOS DE PRINCIPIO A FIN
      .filter(t => t.length > 0); // ELIMINA LOS ELEMENTOS VACIOS
    // SE LLAMA A LA FUNCION PARA CREAR LINKS
    await createLink({ title, url, tags });
    
    // VUELVE A RENDERIZAR TODO A LA PAGINA DEJANDO EL FILTRO INTACTO
    renderListado(tagActivo);
  });

  // SE ENCARGA DE ESCUCHAR LOS CLICKS DE LA SECCION DE FILTROS
  contenedor.querySelectorAll('.tag-btn').forEach(boton => {
    boton.addEventListener('click', () => {
      renderListado(boton.dataset.tag || null); // VUELVE A RENDERIZAR TODO A LA PAGINA CON EL FILTRO SELECCIONADO O NULL SI ES TODOS
    });
  });

  // SE ENCARGA DE ESCUCHAR A TODAS LAS TARJETAS DE LINKS
  contenedor.querySelectorAll('.tarjeta-link').forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
      renderDetalle(tarjeta.dataset.id); // RENDERIZA A DETALLE CON EL ID DEL LINK CLICKEADO
    });
  });
}