// Textos descriptivos estilo Google Maps
const RATING_TEXTS = {
    1: 'Pésimo',
    2: 'Malo',
    3: 'Normal',
    4: 'Muy bueno',
    5: 'Excelente'
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Vincular los eventos de las estrellas una sola vez
    inicializarEstrellasGoogle();

    // 2. Cargar reseñas guardadas
    cargarResenas();

    // 3. Escuchar el envío de formularios
    [1, 2, 3, 4].forEach(id => {
        const formulario = document.getElementById(`form-resena-${id}`);
        if (formulario) {
            formulario.addEventListener('submit', (e) => enviarResena(e, id));
        }
    });

    // 4. Mover carrusel / desplegar panel según URL
    abrirPanelSegunURL();
});

// Lógica para iluminación de estrellas (Hover, Clic y Leave)
function inicializarEstrellasGoogle() {
    const contenedores = document.querySelectorAll('.google-stars');

    contenedores.forEach(contenedor => {
        const formId = contenedor.dataset.form;
        const estrellas = contenedor.querySelectorAll('.star-btn');
        const inputHidden = document.getElementById(`calificacion-${formId}`);
        const labelText = document.getElementById(`rating-label-${formId}`);

        estrellas.forEach((star) => {
            const valor = parseInt(star.dataset.value, 10);

            // Hover: Iluminar hasta la estrella actual
            star.addEventListener('mouseover', () => {
                actualizarEstrellasVisuales(estrellas, valor);
                if (labelText) labelText.textContent = RATING_TEXTS[valor];
            });

            // Click: Fijar el valor seleccionado
            star.addEventListener('click', (e) => {
                e.preventDefault();
                if (inputHidden) inputHidden.value = valor;
                contenedor.dataset.selected = valor;
                actualizarEstrellasVisuales(estrellas, valor);
                if (labelText) labelText.textContent = `${RATING_TEXTS[valor]} (${valor}/5)`;
            });
        });

        // Mouseleave: Regresar al estado seleccionado o apagar
        contenedor.addEventListener('mouseleave', () => {
            const valorSeleccionado = parseInt(contenedor.dataset.selected || 0, 10);
            actualizarEstrellasVisuales(estrellas, valorSeleccionado);
            if (labelText) {
                labelText.textContent = valorSeleccionado > 0 
                    ? `${RATING_TEXTS[valorSeleccionado]} (${valorSeleccionado}/5)` 
                    : 'Selecciona puntuación';
            }
        });
    });
}

// Función encargada de añadir/quitar la clase active
function actualizarEstrellasVisuales(estrellas, valor) {
    estrellas.forEach((star) => {
        const valEstrella = parseInt(star.dataset.value, 10);
        if (valEstrella <= valor) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function abrirPanelSegunURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const albumId = parseInt(urlParams.get('album'), 10);

    if (albumId) {
        setTimeout(() => {
            const carruselElemento = document.getElementById('carruselAlbumes');
            if (carruselElemento && typeof bootstrap !== 'undefined') {
                const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carruselElemento);
                carouselInstance.to(albumId - 1);
            }

            const offcanvasElement = document.getElementById(`offcanvasResenas${albumId}`);
            if (offcanvasElement && typeof bootstrap !== 'undefined') {
                const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
                bsOffcanvas.show();
            }
        }, 150);
    }
}

//Aseguramos la existencia de la función helper escapeHTML
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
async function cargarResenas() {
    const albumesData = {
        1: { total: 0, suma: 0, html: '' },
        2: { total: 0, suma: 0, html: '' },
        3: { total: 0, suma: 0, html: '' },
        4: { total: 0, suma: 0, html: '' }
    };

    let topResenasHTML = '';
    let resenas = [];

    try {
        const respuesta = await fetch('php/obtener_resenas.php');
        if (respuesta.ok) {
            resenas = await respuesta.json();
        } else {
            throw new Error(`Error servidor: ${respuesta.status}`);
        }
    } catch (error) {
        console.warn('Servidor PHP no disponible. Cargando datos locales de prueba:', error);
        // Reseñas de respaldo para que la web funcione sin base de datos activa
        resenas = [
            { producto_id: 1, usuario: 'Carlos M.', calificacion: 5, comentario: '¡Un disco brutal de rap subterráneo!', fecha: '12/05/2026' },
            { producto_id: 2, usuario: 'Andrea S.', calificacion: 5, comentario: 'Líricas necesarias y gran contenido social.', fecha: '14/05/2026' },
            { producto_id: 3, usuario: 'Gonzalo', calificacion: 4, comentario: 'La producción musical de este álbum es impecable.', fecha: '18/05/2026' },
            { producto_id: 4, usuario: 'Valeria R.', calificacion: 5, comentario: 'Energía pura, excelente sonido rock.', fecha: '20/05/2026' }
        ];
    }

    if (Array.isArray(resenas) && resenas.length > 0) {
        resenas.forEach((item) => {
            const targetId = parseInt(item.producto_id, 10) || 1;
            const calificacion = Math.min(Math.max(parseInt(item.calificacion, 10) || 5, 1), 5);
            const estrellas = '★'.repeat(calificacion) + '☆'.repeat(5 - calificacion);
            const fechaTexto = item.fecha || new Date().toLocaleDateString();

            if (albumesData[targetId]) {
                albumesData[targetId].total += 1;
                albumesData[targetId].suma += calificacion;

                albumesData[targetId].html += `
                    <div class="card card-body bg-light p-2 shadow-sm border-0 mb-2">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <strong class="small text-dark">${escapeHTML(item.usuario || 'Anónimo')}</strong>
                            <span class="text-warning small">${estrellas}</span>
                        </div>
                        <p class="mb-1 text-secondary small">${escapeHTML(item.comentario || '')}</p>
                        <small class="text-muted" style="font-size: 0.75rem;">${fechaTexto}</small>
                    </div>
                `;
            }

            if (calificacion >= 3 && item.comentario && item.comentario.trim() !== '') {
                const activeClass = topResenasHTML === '' ? 'active' : '';
                topResenasHTML += `
                    <div class="carousel-item ${activeClass} text-center p-3">
                        <span class="text-warning fs-5">${estrellas}</span>
                        <blockquote class="blockquote my-2">
                            <p class="fs-6 text-white">"${escapeHTML(item.comentario.trim())}"</p>
                        </blockquote>
                        <figcaption class="blockquote-footer text-light m-0">
                            ${escapeHTML(item.usuario || 'Anónimo')}
                        </figcaption>
                    </div>
                `;
            }
        });
    }

    // Renderizar en los Offcanvas
    [1, 2, 3, 4].forEach(id => {
        const contenedorList = document.getElementById(`lista-resenas-${id}`);
        if (contenedorList) {
            contenedorList.innerHTML = albumesData[id].html || '<p class="text-muted small">Aún no hay reseñas para este álbum. ¡Sé el primero!</p>';
        }

        const total = albumesData[id].total;
        const promedio = total > 0 ? (albumesData[id].suma / total).toFixed(1) : '0.0';
        
        const elementoRating = document.getElementById(`rating-album-${id}`);
        if (elementoRating) {
            if (total > 0) {
                elementoRating.innerHTML = `⭐ <strong>${promedio}</strong> / 5.0 (${total} ${total === 1 ? 'reseña' : 'reseñas'})`;
            } else {
                elementoRating.innerHTML = `⭐ <strong>Sin valoraciones</strong>`;
            }
        }
    });

    // Renderizar Carrusel Top
    const contenedorTop = document.getElementById('contenedorCarruselTopReviews');
    if (contenedorTop) {
        contenedorTop.innerHTML = topResenasHTML || `
            <div class="carousel-item active text-center p-3">
                <p class="text-muted m-0">Sé el primero en calificar tus álbumes favoritos.</p>
            </div>
        `;

        const elCarrusel = document.getElementById('carruselTopReviews');
        if (elCarrusel && typeof bootstrap !== 'undefined') {
            const inst = bootstrap.Carousel.getOrCreateInstance(elCarrusel, { interval: 3000, ride: 'carousel' });
            inst.cycle();
        }
    }
}
async function enviarResena(e, idFormulario) {
    e.preventDefault();

    const usuarioInput = document.getElementById(`usuario-${idFormulario}`) || document.getElementById(`nombre-${idFormulario}`);
    const calificacionInput = document.getElementById(`calificacion-${idFormulario}`);
    const comentarioInput = document.getElementById(`comentario-${idFormulario}`);

    const calificacionValor = calificacionInput ? parseInt(calificacionInput.value, 10) : 0;

    if (!calificacionValor || calificacionValor < 1 || calificacionValor > 5) {
        alert("Por favor selecciona una puntuación de 1 a 5 estrellas.");
        return;
    }

    const datos = {
        producto_id: parseInt(idFormulario, 10),
        usuario: usuarioInput && usuarioInput.value.trim() !== '' ? usuarioInput.value.trim() : 'Anónimo',
        calificacion: calificacionValor,
        comentario: comentarioInput ? comentarioInput.value.trim() : ''
    };

    try {
        const respuesta = await fetch('php/guardar_resena.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (resultado.status === 'success') {
            const form = document.getElementById(`form-resena-${idFormulario}`);
            form.reset();

            const contenedorEstrellas = form.querySelector('.google-stars');
            if (contenedorEstrellas) {
                delete contenedorEstrellas.dataset.selected;
                actualizarEstrellasVisuales(contenedorEstrellas.querySelectorAll('.star-btn'), 0);
            }

            const labelText = document.getElementById(`rating-label-${idFormulario}`);
            if (labelText) labelText.textContent = 'Selecciona puntuación';

            if (calificacionInput) calificacionInput.value = '0';

            cargarResenas();
        } else {
            alert('Error: ' + resultado.message);
        }
    } catch (error) {
        console.error('Error al enviar la reseña:', error);
        alert('No se pudo conectar con el servidor.');
    }
}