<?php
$host = "127.0.0.1";
$usuario = "root";
$clave = "";
$bd = "MusicMania";
$puerto = 3307; // Puerto extraído de tu config.inc.php

mysqli_report(MYSQLI_REPORT_OFF);

// 1. Conexión especificando el puerto 3307
$conexion = @new mysqli($host, $usuario, $clave, "", $puerto);

if ($conexion->connect_error) {
    echo json_encode([
        "error" => "Error de conexión a MySQL",
        "detalle" => $conexion->connect_error
    ]);
    exit;
}

// 2. Crear la base de datos si no existe y forzar UTF-8 para emojis y acentos
$sqlCrearBD = "CREATE DATABASE IF NOT EXISTS $bd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
if ($conexion->query($sqlCrearBD)) {
    $conexion->select_db($bd);
    $conexion->set_charset("utf8mb4");
} else {
    echo json_encode(["error" => "Error al crear la BD: " . $conexion->error]);
    exit;
}

// 3. Crear la tabla de artista si no existe
$sqlTablaArtistas = "CREATE TABLE IF NOT EXISTS artistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
$conexion->query($sqlTablaArtistas);

// 4. Insertar datos iniciales si la tabla de artista está vacía
$consultaConteo = $conexion->query("SELECT COUNT(*) as total FROM artistas");
if ($consultaConteo) {
    $fila = $consultaConteo->fetch_assoc();
    if ($fila['total'] == 0) {
        $sqlInsertarIniciales = "INSERT INTO artistas (nombre) VALUES
            ('Ley20mil'),
            ('PortaVoz'),
            ('kase.O'),
            ('Måneskin')";

        $conexion->query($sqlInsertarIniciales);
    }
}
// 5. Crear la tabla de productos si no existe
$sqlTablaProductos = "CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artista_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artista_id) REFERENCES artistas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
$conexion->query($sqlTablaProductos);

// 6. Insertar datos iniciales si la tabla de productos está vacía
$consultaConteo = $conexion->query("SELECT COUNT(*) as total FROM productos");
if ($consultaConteo) {
    $fila = $consultaConteo->fetch_assoc();
    if ($fila['total'] == 0) {
        $sqlInsertarIniciales = "INSERT INTO productos (artista_id, nombre, precio, imagen) VALUES
            (1, 'Naturaleza Muerta', 20000, 'img/Ley20mil.jpg'),
            (2, 'Rap con R de Revolucion', 18000, 'img/RdeRevolucion.jpg'),
            (3, 'El Circulo', 22000, 'img/Elcirculo.jpg'),
            (4, 'Teatro d''ira', 25000, 'img/maneskin.jpg')";

        $conexion->query($sqlInsertarIniciales);
    }
}

// 7. Crear la tabla de reseñas e insertar datos iniciales
$sqlTablaResenas = "CREATE TABLE IF NOT EXISTS resenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    comentario TEXT NULL,
    calificacion INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
$conexion->query($sqlTablaResenas);

// 8. Insertar datos de prueba si la tabla reseñaestá vacía
$consultaResenas = $conexion->query("SELECT COUNT(*) as total FROM resenas");
if ($consultaResenas) {
    $filaResenas = $consultaResenas->fetch_assoc();
    if ($filaResenas['total'] == 0) {
        $sqlInsertarResenas = "INSERT INTO resenas (producto_id, usuario, comentario, calificacion) VALUES
            (2, 'Carlos M.', '¡Simplemente impresionante! Las guitarras y la energía del disco R de Revolución te atrapan desde el primer segundo.', 5),
            (1, 'Andrea G.', 'La producción lírica de Ley 20 Mil es de otro nivel. Las letras reflejan exactamente la realidad urbana moderna.', 5),
            (3, 'Felipe S.', 'Excelentes bajos y una atmósfera envolvente. Ideal para escuchar con buenos audífonos. ¡Un 10 absoluto!', 5),
            (4, 'Valeria R.', 'Pura potencia rockera italiana. La voz de Damiano y el bajo de Victoria destacan en cada tema de Teatro d''ira.', 5)";

        $conexion->query($sqlInsertarResenas);
    }
}
