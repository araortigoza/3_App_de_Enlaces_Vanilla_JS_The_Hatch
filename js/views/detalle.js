async function renderDetalle(id) {
  const contenedor = document.getElementById('app');
  contenedor.innerHTML = '<p>Cargando enlace...</p>';

  const link = await getLinkById(id);
  const comentarios = await getComments(id);

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

  contenedor.querySelector('#btn-volver').addEventListener('click', () => {
    renderListado();
  });

  contenedor.querySelector('#btn-votar').addEventListener('click', async () => {
    await voteLink(id);
    renderDetalle(id);
  });

  contenedor.querySelector('#form-comentario').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const autor = document.getElementById('input-autor').value;
    const text = document.getElementById('input-text').value;

    await createComment(id, { autor, text });
    renderDetalle(id);
  });
}