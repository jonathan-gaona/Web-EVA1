// Obtener productos desde PHP y mostrarlos en consola o pantalla
async function cargarProductos() {
    try {
        const res = await fetch('php/obtener_productos.php');
        const productos = await res.json();
        console.log("Productos desde MySQL:", productos);
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// Enviar reseña a PHP
async function enviarResena(usuario, comentario, calificacion) {
    try {
        const res = await fetch('php/guardar_resena.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, comentario, calificacion })
        });
        const respuesta = await res.json();
        alert(respuesta.message);
    } catch (error) {
        console.error("Error al enviar reseña:", error);
    }
}