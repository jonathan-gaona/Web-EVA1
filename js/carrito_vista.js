document.addEventListener('DOMContentLoaded', renderizarCarrito);

function renderizarCarrito() {
    const contenedor = document.getElementById('lista-carrito');
    const totalElemento = document.getElementById('total-carrito');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = '<div class="alert alert-info">Tu carrito de compras está vacío.</div>';
        if (totalElemento) totalElemento.innerText = '$ 0';
        return;
    }

    contenedor.innerHTML = '';
    let total = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        contenedor.innerHTML += `
            <article class="d-flex align-items-center gap-3 border-bottom pb-3 mb-3">
                <img src="${item.imagen}" class="cart-product-image" alt="Portada ${item.nombre}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
                <div class="flex-grow-1">
                    <h2 class="h5 mb-1">${item.nombre}</h2>
                    <p class="small text-muted mb-0">$${Number(item.precio).toLocaleString('es-CL')}</p>
                </div>
                <strong>$ ${Number(subtotal).toLocaleString('es-CL')}</strong>
                <div class="quantity-control d-flex align-items-center gap-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${index}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${index}, 1)">+</button>
                    <button type="button" class="btn btn-sm btn-link text-danger ms-2" onclick="eliminarProducto(${index})">✕</button>
                </div>
            </article>
        `;
    });

    if (totalElemento) {
        totalElemento.innerText = `$ ${Number(total).toLocaleString('es-CL')}`;
    }
}

function cambiarCantidad(index, cambio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito[index]) {
        carrito[index].cantidad += cambio;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
        if (typeof actualizarContadorCarrito === 'function') {
            actualizarContadorCarrito();
        }
    }
}

function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
    }
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    renderizarCarrito();
    if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
    }
}