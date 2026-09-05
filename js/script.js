// Función para procesar y validar el formulario de contacto
function enviarContacto(event) {
    // Detener la recarga automática de la página
    event.preventDefault();

    // Obtener los valores de los elementos del HTML
    const emailInput = document.getElementById("email").value.trim().toLowerCase();
    const alertaExito = document.getElementById("mensajeExito");
    const alertaError = document.getElementById("mensajeError");
    // Expresión regular que permite únicamente correos terminados en @gmail.com o @hotmail.com
    const regexCorreoPermitido = /^[\w-\.]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

    // Ocultar alertas anteriores antes de validar
    alertaExito.classList.add("d-none");
    alertaError.classList.add("d-none");

    // Validar el correo ingresado
    if (!regexCorreoPermitido.test(emailInput)) {
        // Mostrar alerta roja de error si el dominio no es gmail ni hotmail
        alertaError.textContent = "Error: El correo debe ser un dominio permitido (@gmail.com, @duoc.cl, @profesor.duoc.cl).";
        alertaError.classList.remove("d-none");
        return; // Cortar ejecución
    }

    // Si la validación es correcta, mostrar la alerta verde de éxito
    alertaExito.classList.remove("d-none");

    // Limpiar todos los campos del formulario
    document.getElementById("formContacto").reset();
}

// Función adicional de interacción para el botón del index.html
function mostrarBienvenida() {
    alert("¡Gracias por visitar MusicMania! Revisa nuestras ofertas en vinilos y CDs.");
}