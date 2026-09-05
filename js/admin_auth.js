document.addEventListener("DOMContentLoaded", () => {
    // Simular o leer usuario autenticado
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioSesion")) || {
        nombre: "Administrador",
        rol: "Administrador" // Cambiar a 'Vendedor' para probar restricciones
    };

    const welcomeMsg = document.getElementById("welcomeMsg");
    if (welcomeMsg) {
        welcomeMsg.textContent = `¡HOLA ${usuarioActivo.nombre}! (${usuarioActivo.rol})`;
    }

    // Aplicar restricciones si es Vendedor
    if (usuarioActivo.rol === "Vendedor") {
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");
    }

    // Cerrar sesión
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("usuarioSesion");
            window.location.href = "iniciar_sesion.html";
        });
    }
});