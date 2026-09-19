async function renderListado(tagActivo) {
  const contenedor = document.getElementById('app');
  contenedor.innerHTML = '<p>Cargando enlaces...</p>';

  const todosLosLinks = await getLinks();
  const tagsUnicos = [...new Set(todosLosLinks.flatMap(link => link.tags))];
  const links = tagActivo ? todosLosLinks.filter(link => link.tags.includes(tagActivo)) : todosLosLinks;

  contenedor.innerHTML = `
    <section class="formulario">
      <h2>Agregar enlace</h2>
      <form id="form-nuevo-link">
        <input type="text" id="input-title" placeholder="Titulo" required>
        <input type="url" id="input-url" placeholder="https://..." required>
        <input type="text" id="input-tags" placeholder="Tags separados por coma" maxlength="100">
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

  contenedor.querySelector('#form-nuevo-link').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const title = document.getElementById('input-title').value;
    const url = document.getElementById('input-url').value;
    const tags = document.getElementById('input-tags').value
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    await createLink({ title, url, tags });
    renderListado(tagActivo);
  });

  contenedor.querySelectorAll('.tag-btn').forEach(boton => {
    boton.addEventListener('click', () => {
      renderListado(boton.dataset.tag || null);
    });
  });

  contenedor.querySelectorAll('.tarjeta-link').forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
      renderDetalle(tarjeta.dataset.id);
    });
  });
}