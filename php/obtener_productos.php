<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');

require_once 'conexion.php';

/** @var mysqli $conexion */

header('Content-Type: application/json; charset=utf-8');

// Incluir la conexión
require_once 'conexion.php';

$productos = array();

if ($conexion && !$conexion->connect_error) {
    $sql = "SELECT id, nombre, precio, imagen FROM productos";
    $resultado = $conexion->query($sql);

    if ($resultado && $resultado->num_rows > 0) {
        while ($fila = $resultado->fetch_assoc()) {
            $productos[] = array(
                "id" => (int)$fila['id'],
                "nombre" => $fila['nombre'],
                "precio" => (float)$fila['precio'],
                "imagen" => $fila['imagen']
            );
        }
    }
} else {
    // En caso de falla de conexión, devolver objeto informativo
    echo json_encode(["error" => "No se pudo conectar a la base de datos"]);
    exit;
}

// Retornar el listado en formato JSON
echo json_encode($productos, JSON_UNESCAPED_UNICODE);

// Cerrar conexión
if ($conexion) {
    $conexion->close();
}
