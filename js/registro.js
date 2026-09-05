document.addEventListener("DOMContentLoaded", () => {
    const formRegistro = document.getElementById("formRegistro");

    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const run = document.getElementById("run");
        const nombre = document.getElementById("nombre");
        const apellidos = document.getElementById("apellidos");
        const correo = document.getElementById("correo");
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirmPassword");
        const region = document.getElementById("region");
        const comuna = document.getElementById("comuna");
        const direccion = document.getElementById("direccion");

        // Validaciones individuales
        const vRun = validarRun(run.value.trim());
        const vNombre = nombre.value.trim().length > 0 && nombre.value.trim().length <= 50;
        const vApellidos = apellidos.value.trim().length > 0 && apellidos.value.trim().length <= 100;
        const vCorreo = validarCorreo(correo.value.trim());
        const vPass = password.value.trim().length >= 4 && password.value.trim().length <= 10;
        const vPassMatch = vPass && (password.value.trim() === confirmPassword.value.trim());
        const vRegion = region.value !== "";
        const vComuna = comuna.value !== "";
        const vDireccion = direccion.value.trim().length > 0 && direccion.value.trim().length <= 300;

        // Visualización de validez
        marcarCampo(run, vRun);
        marcarCampo(nombre, vNombre);
        marcarCampo(apellidos, vApellidos);
        marcarCampo(correo, vCorreo);
        marcarCampo(password, vPass);
        marcarCampo(confirmPassword, vPassMatch);
        marcarCampo(region, vRegion);
        marcarCampo(comuna, vComuna);
        marcarCampo(direccion, vDireccion);

        if (!vRun || !vNombre || !vApellidos || !vCorreo || !vPass || !vPassMatch || !vRegion || !vComuna || !vDireccion) {
            return;
        }

        // Verificar si el correo ya existe
        const usuarios = JSON.parse(localStorage.getItem("usuariosApp")) || [];
        const correoExiste = usuarios.some(u => u.correo.toLowerCase() === correo.value.trim().toLowerCase());

        if (correoExiste) {
            alert("El correo electrónico ya se encuentra registrado.");
            marcarCampo(correo, false);
            return;
        }

        // Crear y guardar el nuevo usuario con rol 'Cliente'
        const nuevoUsuario = {
            run: run.value.trim(),
            nombre: nombre.value.trim(),
            apellidos: apellidos.value.trim(),
            correo: correo.value.trim(),
            password: password.value.trim(),
            region: region.value,
            comuna: comuna.value,
            direccion: direccion.value.trim(),
            rol: "Cliente"
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuariosApp", JSON.stringify(usuarios));

        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        window.location.href = "iniciar_sesion.html";
    });

    // Validar RUN sin puntos ni guion (7 a 9 caracteres alfanuméricos)
    function validarRun(run) {
        const regexRun = /^[0-9]{7,8}[0-9kK]{1}$/;
        return regexRun.test(run);
    }

    // Validar correo con dominios exigidos
    function validarCorreo(correo) {
        if (!correo || correo.length > 100) return false;
        const regexDominio = /^[\w-\.]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
        return regexDominio.test(correo);
    }

    // Aplicar estilos Bootstrap
    function marcarCampo(inputElement, esValido) {
        if (esValido) {
            inputElement.classList.remove("is-invalid");
            inputElement.classList.add("is-valid");
        } else {
            inputElement.classList.remove("is-valid");
            inputElement.classList.add("is-invalid");
        }
    }
});