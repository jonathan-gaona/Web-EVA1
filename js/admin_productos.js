// Cargar productos al iniciar
var productos = JSON.parse(localStorage.getItem("productosApp")) || [
    { codigo: "VIN-001", nombre: "Abbey Road", categoria: "Vinilos", precio: 29990, stock: 2, stockCritico: 5 },
    { codigo: "CD-002", nombre: "Random Access Memories", categoria: "CDs", precio: 15990, stock: 10, stockCritico: 5 }
];

mostrarTabla();

// Guardar o Editar
document.getElementById("formProducto").addEventListener("submit", function(e) {
    e.preventDefault();

    var codigo = document.getElementById("codigo").value.trim();
    var nombre = document.getElementById("nombre").value.trim();
    var categoria = document.getElementById("categoria").value;
    var precio = parseInt(document.getElementById("precio").value);
    var stock = parseInt(document.getElementById("stock").value);
    var stockCritico = parseInt(document.getElementById("stockCritico").value);
    var indexEdit = parseInt(document.getElementById("indexEdit").value);

    // Validaciones básicas según pauta
    if (codigo.length < 3) {
        alert("El código debe tener al menos 3 caracteres.");
        return;
    }
    if (nombre === "" || nombre.length > 100) {
        alert("El nombre es obligatorio y no debe superar los 100 caracteres.");
        return;
    }
    if (categoria === "") {
        alert("Debe seleccionar una categoría.");
        return;
    }
    if (isNaN(precio) || precio < 0) {
        alert("El precio debe ser un número mayor o igual a 0.");
        return;
    }
    if (isNaN(stock) || stock < 0) {
        alert("El stock debe ser mayor o igual a 0.");
        return;
    }

    var nuevoProd = {
        codigo: codigo,
        nombre: nombre,
        categoria: categoria,
        precio: precio,
        stock: stock,
        stockCritico: stockCritico
    };

    if (indexEdit === -1) {
        // Agregar
        productos.push(nuevoProd);
        alert("Producto agregado correctamente.");
    } else {
        // Editar
        productos[indexEdit] = nuevoProd;
        alert("Producto editado correctamente.");
    }

    localStorage.setItem("productosApp", JSON.stringify(productos));
    limpiarFormulario();
    mostrarTabla();
});

// Renderizar la tabla en pantalla
function mostrarTabla() {
    var tbody = document.getElementById("tablaProductos");
    tbody.innerHTML = "";

    for (var i = 0; i < productos.length; i++) {
        var p = productos[i];
        
        // Determinar si el stock es crítico
        var estado = "OK";
        var claseBadge = "bg-success";
        if (p.stock <= p.stockCritico) {
            estado = "¡Stock Crítico!";
            claseBadge = "bg-danger";
        }

        var fila = "<tr>" +
            "<td>" + p.codigo + "</td>" +
            "<td>" + p.nombre + "</td>" +
            "<td>" + p.categoria + "</td>" +
            "<td>$" + p.precio + "</td>" +
            "<td>" + p.stock + "</td>" +
            "<td><span class='badge " + claseBadge + "'>" + estado + "</span></td>" +
            "<td>" +
                "<button class='btn btn-warning btn-sm me-1' onclick='cargarEditar(" + i + ")'>Editar</button>" +
                "<button class='btn btn-danger btn-sm' onclick='borrarProducto(" + i + ")'>Eliminar</button>" +
            "</td>" +
        "</tr>";

        tbody.innerHTML += fila;
    }
}

// Cargar datos en el formulario para editar
function cargarEditar(index) {
    var p = productos[index];
    document.getElementById("codigo").value = p.codigo;
    document.getElementById("nombre").value = p.nombre;
    document.getElementById("categoria").value = p.categoria;
    document.getElementById("precio").value = p.precio;
    document.getElementById("stock").value = p.stock;
    document.getElementById("stockCritico").value = p.stockCritico;
    document.getElementById("indexEdit").value = index;

    document.getElementById("tituloForm").textContent = "Editar Producto #" + (index + 1);
    document.getElementById("btnGuardar").textContent = "Actualizar Producto";
}

// Eliminar
function borrarProducto(index) {
    if (confirm("¿Deseas eliminar este producto?")) {
        productos.splice(index, 1);
        localStorage.setItem("productosApp", JSON.stringify(productos));
        mostrarTabla();
    }
}

// Resetear formulario
function limpiarFormulario() {
    document.getElementById("formProducto").reset();
    document.getElementById("indexEdit").value = "-1";
    document.getElementById("tituloForm").textContent = "Agregar Producto";
    document.getElementById("btnGuardar").textContent = "Guardar Producto";
}