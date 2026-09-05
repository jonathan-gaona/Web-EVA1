document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar usuarios de prueba en localStorage si aún no existen
    inicializarUsuariosPrueba();

    const formLogin = document.getElementById("formLogin");
    const correoInput = document.getElementById("correo");
    const passwordInput = document.getElementById("password");
    const alertError = document.getElementById("alertError");

    // 2. Escuchar el evento submit del formulario
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();

        alertError.classList.add("d-none");

        // Validaciones individuales
        const isCorreoValido = validarCorreo(correoInput.value.trim());
        const isPasswordValida = validarPassword(passwordInput.value.trim());

        // Manejo visual de clases Bootstrap (was-validated / is-invalid)
        marcarCampo(correoInput, isCorreoValido);
        marcarCampo(passwordInput, isPasswordValida);

        if (!isCorreoValido || !isPasswordValida) {
            return; // Si no pasa la validación visual, detener el proceso
        }

        // 3. Autenticar credenciales contra el localStorage
        const usuarios = JSON.parse(localStorage.getItem("usuariosApp")) || [];
        const usuarioEncontrado = usuarios.find(
            (u) => u.correo.toLowerCase() === correoInput.value.trim().toLowerCase() && u.password === passwordInput.value.trim()
        );

        if (usuarioEncontrado) {
            // Guardar la sesión activa del usuario
            localStorage.setItem("usuarioSesion", JSON.stringify(usuarioEncontrado));

            // 4. Redirección basada en el ROL del usuario
            if (usuarioEncontrado.rol === "Administrador" || usuarioEncontrado.rol === "Vendedor") {
                window.location.href = "admin_dashboard.html";
            } else {
                window.location.href = "index.html"; // Redirige a la tienda para clientes
            }
        } else {
            // Credenciales erróneas
            alertError.classList.remove("d-none");
        }
    });

    // --- FUNCIONES AUXILIARES Y VALIDACIONES ---

    // Validar Dominios requeridos: @duoc.cl, @profesor.duoc.cl, @gmail.com
    function validarCorreo(correo) {
        if (!correo || correo.length > 100) return false;
        const regexDominio = /^[\w-\.]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
        return regexDominio.test(correo);
    }

    // Validar largo de contraseña (entre 4 y 10 caracteres)
    function validarPassword(pass) {
        return pass.length >= 4 && pass.length <= 10;
    }

    // Cambiar estilos del campo según validez
    function marcarCampo(inputElement, esValido) {
        if (esValido) {
            inputElement.classList.remove("is-invalid");
            inputElement.classList.add("is-valid");
        } else {
            inputElement.classList.remove("is-valid");
            inputElement.classList.add("is-invalid");
        }
    }

    // Poblado inicial con cuentas para probar todos los roles exigidos
    function inicializarUsuariosPrueba() {
        if (!localStorage.getItem("usuariosApp")) {
            const usuariosBase = [
                {
                    nombre: "Admin Principal",
                    correo: "admin@duoc.cl",
                    password: "admin",
                    rol: "Administrador"
                },
                {
                    nombre: "Vendedor Tienda",
                    correo: "vendedor@profesor.duoc.cl",
                    password: "vend",
                    rol: "Vendedor"
                },
                {
                    nombre: "Cliente Ejemplo",
                    correo: "cliente@gmail.com",
                    password: "1234",
                    rol: "Cliente"
                }
            ];
            localStorage.setItem("usuariosApp", JSON.stringify(usuariosBase));
        }
    }
});