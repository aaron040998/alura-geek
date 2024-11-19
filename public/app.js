document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('itemForm');
    const itemsGrid = document.getElementById('itemsGrid');
    const clearFormButton = document.getElementById('clearForm');
    const searchBar = document.getElementById('searchBar');
  
    let allItems = [];
  
    // Función para obtener los productos desde el servidor
    const fetchItems = async () => {
      const response = await fetch('/api/items');
      const items = await response.json();
      allItems = items;
      renderItems(items);
    };
  
    // Función para renderizar los productos
    const renderItems = (items) => {
      itemsGrid.innerHTML = '';
      items.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
          <img src="${item.urlImagen}" alt="${item.nombre}" />
          <h3>${item.nombre}</h3>
          <p>$ ${item.precio}</p>
          <button onclick="deleteItem(${item.id})">🗑️</button>
        `;
        itemsGrid.appendChild(card);
      });
    };
  
    // Función para filtrar productos por nombre
    searchBar.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredItems = allItems.filter(item =>
        item.nombre.toLowerCase().includes(searchTerm)
      );
      renderItems(filteredItems);
    });
  
    // Evento para agregar un nuevo producto
    itemForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value;
      const precio = document.getElementById('precio').value;
      const urlImagen = document.getElementById('urlImagen').value;
  
      await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, precio, urlImagen }),
      });
  
      itemForm.reset();
      fetchItems();
    });
  
    // Botón para limpiar el formulario
    clearFormButton.addEventListener('click', () => {
      itemForm.reset();
    });
  
    // Función para eliminar un producto
    window.deleteItem = async (id) => {
      await fetch(`/api/items/${id}`, { method: 'DELETE' });
      fetchItems();
    };
  
    fetchItems();
  });
  