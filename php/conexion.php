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

// 2. Crear la base de datos si no existe
$sqlCrearBD = "CREATE DATABASE IF NOT EXISTS $bd CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci";
if ($conexion->query($sqlCrearBD)) {
    $conexion->select_db($bd);
} else {
    echo json_encode(["error" => "Error al crear la BD: " . $conexion->error]);
    exit;
}

// 3. Crear la tabla de productos si no existe
$sqlTablaProductos = "CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conexion->query($sqlTablaProductos);

// 4. Insertar datos iniciales si la tabla está vacía
$consultaConteo = $conexion->query("SELECT COUNT(*) as total FROM productos");
if ($consultaConteo) {
    $fila = $consultaConteo->fetch_assoc();
    if ($fila['total'] == 0) {
        $sqlInsertarIniciales = "INSERT INTO productos (nombre, precio, imagen) VALUES
            ('Naturaleza Muerta', 20000, 'img/Ley20mil.jpg'),
            ('Rap con R de Revolucion', 18000, 'img/RdeRevolucion.jpg'),
            ('El Circulo', 22000, 'img/Elcirculo.jpg'),
            ('Teatro d´ira', 25000, 'img/maneskin.jpg')";

        $conexion->query($sqlInsertarIniciales);
    }
}
