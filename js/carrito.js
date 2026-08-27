document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);

function agregarAlCarrito(id, nombre, precio, imagen) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        carrito[index].cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert(`"${nombre}" fue agregado al carrito.`);
}

function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    
    const btnCarrito = document.getElementById('btn-carrito');
    if (btnCarrito) {
        btnCarrito.innerText = `Carrito (${totalItems})`;
    }
}