(() => {
  const products = window.PRODUCTS || [];
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const state = { query: '', category: 'All', sort: 'featured', selected: [] };
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
  }[c]));
  const amazon = p => `https://www.amazon.com/s?k=${encodeURIComponent(p.name)}&tag=electrocomp08-20`;
  const price = n => '$' + Number(n || 0).toLocaleString();

  function renderCategories() {
    $('categories').innerHTML = categories.map(c =>
      `<button class="chip ${state.category === c ? 'active' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`
    ).join('');
  }

  function filteredProducts() {
    let list = products.filter(p => {
      const categoryOK = state.category === 'All' || p.category === state.category;
      const text = `${p.name} ${p.brand} ${p.category} ${p.desc}`.toLowerCase();
      return categoryOK && text.includes(state.query.toLowerCase());
    });
    if (state.sort === 'az') list.sort((a,b) => a.name.localeCompare(b.name));
    if (state.sort === 'za') list.sort((a,b) => b.name.localeCompare(a.name));
    if (state.sort === 'priceLow') list.sort((a,b) => a.price - b.price);
    if (state.sort === 'priceHigh') list.sort((a,b) => b.price - a.price);
    return list;
  }

  function renderVisual(p) {
    return `<div class="visual">
      <span class="badge">${esc(p.brand)}</span>
      <div class="device ${esc(p.type || '')}">${esc(p.name)}</div>
    </div>`;
  }

  function renderProducts() {
    const list = filteredProducts();
    $('resultCount').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
    $('grid').innerHTML = list.map(p => {
      const selected = state.selected.includes(p.id);
      const disabled = !selected && state.selected.length >= 3;
      return `<article class="product-card">
        ${renderVisual(p)}
        <div class="product-body">
          <div class="category">${esc(p.category)}</div>
          <h3>${esc(p.name)}</h3>
          <div class="meta">${esc(p.desc)}</div>
          <div class="price">${price(p.price)}</div>
          <div class="actions">
            <a class="buy" href="${amazon(p)}" target="_blank" rel="nofollow sponsored noopener">View on Amazon</a>
            <button class="compare-btn ${selected ? 'selected' : ''}" data-id="${p.id}" ${disabled ? 'disabled' : ''}>
              ${selected ? '✓ Selected' : 'Compare'}
            </button>
          </div>
        </div>
      </article>`;
    }).join('');
    $('empty').hidden = list.length !== 0;
    bindCompareButtons();
    updateCompareUI();
  }

  function bindCompareButtons() {
    document.querySelectorAll('.compare-btn').forEach(button => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.id);
        if (state.selected.includes(id)) {
          state.selected = state.selected.filter(x => x !== id);
        } else if (state.selected.length < 3) {
          state.selected.push(id);
        }
        renderProducts();
      });
    });
  }

  function updateCompareUI() {
    $('compareCount').textContent = state.selected.length;
    $('compareLabel').textContent = `${state.selected.length} selected`;
    $('compareBar').hidden = state.selected.length === 0;
  }

  function buildComparison() {
    const selectedProducts = state.selected
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);

    if (!selectedProducts.length) return;

    const rows = [
      ['Product', p => `<strong>${esc(p.name)}</strong><br><small>${esc(p.brand)}</small><br><button class="remove" data-remove="${p.id}">Remove</button>`],
      ['Category', p => esc(p.category)],
      ['Price', p => price(p.price)],
      ['Description', p => esc(p.desc)],
      ['Amazon', p => `<a href="${amazon(p)}" target="_blank" rel="nofollow sponsored noopener">View listing</a>`]
    ];

    $('compareTable').innerHTML = `<div class="comparison"><table><tbody>
      ${rows.map(([label, fn]) => `<tr><th>${label}</th>${selectedProducts.map(p => `<td>${fn(p)}</td>`).join('')}</tr>`).join('')}
    </tbody></table></div>`;

    $('compareModal').hidden = false;
    $('compareModal').scrollTop = 0;

    document.querySelectorAll('[data-remove]').forEach(button => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.remove);
        state.selected = state.selected.filter(x => x !== id);
        if (!state.selected.length) {
          $('compareModal').hidden = true;
        } else {
          buildComparison();
        }
        renderProducts();
      });
    });
  }

  document.addEventListener('click', event => {
    const categoryButton = event.target.closest('[data-cat]');
    if (categoryButton) {
      state.category = categoryButton.dataset.cat;
      renderCategories();
      renderProducts();
    }
  });

  $('search').addEventListener('input', event => {
    state.query = event.target.value;
    renderProducts();
  });

  $('sort').addEventListener('change', event => {
    state.sort = event.target.value;
    renderProducts();
  });

  $('compareNow').addEventListener('click', buildComparison);
  $('compareOpen').addEventListener('click', () => {
    if (state.selected.length) buildComparison();
  });
  $('compareClose').addEventListener('click', () => {
    $('compareModal').hidden = true;
  });
  $('compareModal').addEventListener('click', event => {
    if (event.target.id === 'compareModal') $('compareModal').hidden = true;
  });
  $('clearCompare').addEventListener('click', () => {
    state.selected = [];
    $('compareModal').hidden = true;
    renderProducts();
  });

  renderCategories();
  renderProducts();
})();
