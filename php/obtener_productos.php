<?php
// Durante desarrollo es mejor no ocultar los errores para poder depurar
// error_reporting(0);
// ini_set('display_errors', 0);

// Configuración de encabezados
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Incluir la conexión a la base de datos
require_once 'conexion.php';

/** @var mysqli $conexion */

// Verificar conexión
if (!$conexion || $conexion->connect_error) {
    echo json_encode([
        "error" => "No se pudo conectar a la base de datos",
        "detalle" => $conexion ? $conexion->connect_error : "Variable \$conexion no disponible"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$productos = array();

$sql = "SELECT id, nombre, precio, imagen FROM productos";
$resultado = $conexion->query($sql);

if ($resultado) {
    while ($fila = $resultado->fetch_assoc()) {
        $productos[] = array(
            "id" => (int)$fila['id'],
            "nombre" => $fila['nombre'],
            "precio" => (float)$fila['precio'],
            "imagen" => $fila['imagen']
        );
    }
} else {
    // Retornar error si la consulta SQL falla
    echo json_encode([
        "error" => "Error al ejecutar la consulta en la base de datos",
        "detalle" => $conexion->error
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Retornar el listado en formato JSON
echo json_encode($productos, JSON_UNESCAPED_UNICODE);

// Cerrar conexión
$conexion->close();
