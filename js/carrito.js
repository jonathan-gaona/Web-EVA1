document.addEventListener('DOMContentLoaded', () => {
    actualizarBotonCarrito();
    
    // Si estamos en la página del carrito, renderizar los productos
    if (document.getElementById('lista-carrito')) {
        renderizarCarrito();
    }
});

// Función para añadir productos (usada en Equipos y Catálogo)
function agregarAlCarrito(nombre, precio, imagen) {
    let carrito = JSON.parse(localStorage.getItem('carritoMusicMania')) || [];
    carrito.push({ nombre, precio, imagen });
    localStorage.setItem('carritoMusicMania', JSON.stringify(carrito));
    
    actualizarBotonCarrito();
    alert(`¡${nombre} se agregó al carrito!`);
}

// Renderiza la lista dentro de carrito_compras.html
function renderizarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carritoMusicMania')) || [];
    const contenedor = document.getElementById('lista-carrito');
    const totalElemento = document.getElementById('total-carrito');

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="text-muted fs-5">Tu carrito está vacío actualmente.</p>';
        totalElemento.innerText = '$ 0';
        return;
    }

    let html = '';
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio;
        html += `
            <div class="card mb-3 border-0 shadow-sm p-3">
                <div class="row align-items-center">
                    <div class="col-md-3 text-center">
                        <img src="${item.imagen}" alt="${item.nombre}" class="img-fluid rounded cart-product-image">
                    </div>
                    <div class="col-md-5">
                        <h5 class="fw-bold mb-1">${item.nombre}</h5>
                        <p class="text-danger fw-bold mb-0">$ ${item.precio.toLocaleString('es-CL')}</p>
                    </div>
                    <div class="col-md-4 text-end">
                        <button class="btn btn-outline-danger btn-sm" onclick="eliminarDelCarrito(${index})">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;
    totalElemento.innerText = `$ ${total.toLocaleString('es-CL')}`;
}

// Elimina un producto específico por su índice
function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carritoMusicMania')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carritoMusicMania', JSON.stringify(carrito));
    
    actualizarBotonCarrito();
    renderizarCarrito();
}

// Limpia todo el carrito
function vaciarCarrito() {
    localStorage.removeItem('carritoMusicMania');
    actualizarBotonCarrito();
    renderizarCarrito();
}

// Actualiza la cifra en el botón Navbar
function actualizarBotonCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carritoMusicMania')) || [];
    const btnCarrito = document.getElementById('btn-carrito');
    if (btnCarrito) {
        btnCarrito.innerText = `Carrito (${carrito.length})`;
    }
}