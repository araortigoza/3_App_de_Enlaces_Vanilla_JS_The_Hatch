// FUNCION PRINCIPAL PARA RENDERIZAR EL DETALLE DE LOS LINKS
async function renderDetalle(id) {
  const contenedor = document.getElementById('app'); // SELECCIONA EL ELEMENTO <main id="app"></main> DEL HTML
  contenedor.innerHTML = '<p>Cargando enlace...</p>'; // MUESTRA UNA PANTALLA DE CARGA

  const link = await getLinkById(id); // CONSULTA A LA API LOS DATOS DEL ENLACE
  const comentarios = await getComments(id); // CONSULTA A LA API LOS COMENTARIOS DE ESE ENLACE

  // INYECCION HTML
  contenedor.innerHTML = `
    <button id="btn-volver" class="volver">← Volver</button>

    <section class="detalle-link">
      <h2>${link.title}</h2>
      <a href="${link.url}" target="_blank" class="url">${link.url}</a>
      <div class="tags">${link.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <button id="btn-votar">▲ ${link.votes} votos</button>
    </section>

    <section class="comentarios">
      <h3>Comentarios</h3>
      <form id="form-comentario">
        <input type="text" id="input-autor" placeholder="Tu nombre" maxlength="30" required>
        <textarea id="input-text" placeholder="Escribi un comentario" maxlength="300" required></textarea>
        <button type="submit">Comentar</button>
      </form>

      <div class="lista-comentarios">
        ${comentarios.length === 0 ? '<p>Todavia no hay comentarios.</p>' : comentarios.map(comentario => `
          <div class="comentario">
            <strong>${comentario.autor}</strong>
            <p>${comentario.text}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  // SE ENCARGA DE ESCUCHAR EL BOTON DE VOLVER
  contenedor.querySelector('#btn-volver').addEventListener('click', () => {
    renderListado(); // RENDERIZA AL LISTADO DE LINK
  });

  // SE ENCARGA DE ESCUCHAR LOS CLICKS EN EL BOTON DE VOTAR
  contenedor.querySelector('#btn-votar').addEventListener('click', async () => {
    await voteLink(id); // LLAMA A LA API PARA REALIZAR LA VOTACION
    renderDetalle(id); // VULVE A RENDERIZAR A DETALLE CON LOS DATOS ACTUALIZADOS
  });

  // SE ENCARGA DE ESCUCHAR EL FORMULARIO DE COMENTARIOS
  contenedor.querySelector('#form-comentario').addEventListener('submit', async (evento) => {
    evento.preventDefault(); // FRENA EL RECARGADO DE LA PAGINA
    // TRAE EL TEXTO ESCRITO POR EL USUARIO
    const autor = document.getElementById('input-autor').value;
    const text = document.getElementById('input-text').value;

    await createComment(id, { autor, text }); // LLAMA A LA API PARA CREAR EL COMENTARIO
    renderDetalle(id); // VULVE A RENDERIZAR A DETALLE CON LOS DATOS ACTUALIZADOS
  });
}