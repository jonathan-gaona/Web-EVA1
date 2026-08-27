<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');

require_once 'conexion.php';

/** @var mysqli $conexion */
// 2. Definir encabezado JSON
header('Content-Type: application/json; charset=utf-8');

// 3. Incluir archivo de conexión
include 'conexion.php';

// 4. Leer los datos enviados por JS (fetch)
$data = json_decode(file_get_contents("php://input"), true);

// 5. Validar que los campos obligatorios vengan en la petición
if (isset($data['usuario']) && isset($data['comentario']) && isset($data['calificacion'])) {

    // Usar la variable $conexion definida en conexion.php
    if (!$conexion || $conexion->connect_error) {
        echo json_encode(["status" => "error", "message" => "Error de conexión a la BD"]);
        exit;
    }

    // Asegurar que la tabla 'resenas' existe antes de insertar
    $sqlTabla = "CREATE TABLE IF NOT EXISTS resenas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(100) NOT NULL,
        comentario TEXT NOT NULL,
        calificacion INT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conexion->query($sqlTabla);

    // Limpiar variables usando $conexion
    $usuario = $conexion->real_escape_string($data['usuario']);
    $comentario = $conexion->real_escape_string($data['comentario']);
    $calificacion = (int)$data['calificacion'];

    // Insertar en la base de datos
    $sql = "INSERT INTO resenas (usuario, comentario, calificacion) VALUES ('$usuario', '$comentario', $calificacion)";

    if ($conexion->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Reseña guardada exitosamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => $conexion->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
