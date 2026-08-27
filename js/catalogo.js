document.addEventListener('DOMContentLoaded', cargarCatalogo);

async function cargarCatalogo() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    try {
        const respuesta = await fetch('php/obtener_productos.php');
        const productos = await respuesta.json();

        // 1. Si PHP devolvió un objeto de error (ej: fallo de conexión)
        if (productos.error) {
            contenedor.innerHTML = `<div class="col-12 text-center text-danger"><p><strong>Error del Servidor:</strong> ${productos.error}</p>${productos.detalle ? `<small class="text-muted">${productos.detalle}</small>` : ''}</div>`;
            return;
        }

        // 2. Si la respuesta no es una lista/arreglo válido
        if (!Array.isArray(productos)) {
            contenedor.innerHTML = '<p class="text-center text-danger">Respuesta no válida del servidor.</p>';
            return;
        }

        // 3. Si la lista está vacía
        if (productos.length === 0) {
            contenedor.innerHTML = '<p class="text-center">No hay productos registrados en la base de datos.</p>';
            return;
        }

        // 4. Renderizar productos correctamente
        contenedor.innerHTML = '';
        productos.forEach(prod => {
            contenedor.innerHTML += `
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}" style="height: 250px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${prod.nombre}</h5>
                            <p class="card-text text-danger fw-bold">$${Number(prod.precio).toLocaleString('es-CL')}</p>
                            <button onclick="agregarAlCarrito(${prod.id}, '${prod.nombre}', ${prod.precio}, '${prod.imagen}')" class="btn btn-success mt-auto">
                                Agregar al Carrito
                            </button>
                            <a href="blog_reseñas.html" class="btn btn-outline-primary mt-2">Ver reseña</a>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        contenedor.innerHTML = '<p class="text-center text-danger">Error al conectar con el servidor.</p>';
        console.error('Error detallado:', error);
    }
}