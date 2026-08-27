document.addEventListener('DOMContentLoaded', () => {
    cargarCatalogo();
    cargarCarruselResenas();
});

// 1. CARGA DEL CATÁLOGO DE PRODUCTOS
async function cargarCatalogo() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    try {
        const respuesta = await fetch('php/obtener_productos.php');
        const productos = await respuesta.json();

        if (productos.error) {
            contenedor.innerHTML = `<div class="col-12 text-center text-danger"><p><strong>Error del Servidor:</strong> ${productos.error}</p>${productos.detalle ? `<small class="text-muted">${productos.detalle}</small>` : ''}</div>`;
            return;
        }

        if (!Array.isArray(productos)) {
            contenedor.innerHTML = '<p class="text-center text-danger">Respuesta no válida del servidor.</p>';
            return;
        }

        if (productos.length === 0) {
            contenedor.innerHTML = '<p class="text-center">No hay productos registrados en la base de datos.</p>';
            return;
        }

        contenedor.innerHTML = '';
        productos.forEach(prod => {
            contenedor.innerHTML += `
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}" style="height: 250px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${prod.nombre}</h5>
                            <p class="card-text text-danger fw-bold">$${Number(prod.precio).toLocaleString('es-CL')}</p>
                            <button onclick="agregarAlCarrito(${prod.id}, '${prod.nombre.replace(/'/g, "\\'")}', ${prod.precio}, '${prod.imagen}')" class="btn btn-success mt-auto">
                                Agregar al Carrito
                            </button>
                            <a href="blog_resenas.html?album=${prod.id}" class="btn btn-outline-primary mt-2">Ver reseña</a>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        contenedor.innerHTML = '<p class="text-center text-danger">Error al conectar con el servidor.</p>';
        console.error('Error detallado catálogo:', error);
    }
}

// 2. CARGA DEL CARRUSEL DE RESEÑAS TOP
async function cargarCarruselResenas() {
    const contenedor = document.getElementById('contenedorCarruselResenas');
    if (!contenedor) return;

    try {
        const respuesta = await fetch('php/obtener_resenas.php');
        const resenas = await respuesta.json();

        if (!Array.isArray(resenas) || resenas.length === 0) {
            contenedor.innerHTML = `
                <div class="carousel-item active text-center p-3">
                    <p class="text-muted m-0">No hay resenas registradas aún.</p>
                </div>`;
            return;
        }

        contenedor.innerHTML = resenas.map((resena, index) => {
            const estrellasHTML = Array.from({ length: 5 }, (_, i) => 
                `<i class="bi bi-star${i < resena.calificacion ? '-fill' : ''}"></i>`
            ).join('');

            return `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <div class="row align-items-center justify-content-center p-3">
                        <div class="col-auto">
                            <img src="${resena.imagen || 'img/default.jpg'}" 
                                 class="rounded-circle shadow" 
                                 alt="${resena.producto_nombre || 'Producto'}" 
                                 style="width: 100px; height: 100px; object-fit: cover;">
                        </div>
                        <div class="col-md-8">
                            <div class="text-warning mb-1 fs-5">
                                ${estrellasHTML}
                                <span class="badge bg-danger ms-2">${parseFloat(resena.calificacion).toFixed(1)} / 5</span>
                            </div>
                            <blockquote class="blockquote mb-1 fs-6">
                                <p>"${resena.comentario}"</p>
                            </blockquote>
                            <figcaption class="blockquote-footer text-light opacity-75 m-0">
                                Por <cite title="Usuario">${resena.usuario}</cite> sobre <strong>${resena.producto_nombre || 'Álbum'}</strong>
                            </figcaption>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error al cargar reseñas:', error);
        contenedor.innerHTML = `
            <div class="carousel-item active text-center p-3">
                <p class="text-danger m-0">Error al conectar con las resenas.</p>
            </div>`;
    }
}