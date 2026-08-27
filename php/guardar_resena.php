<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');

// Configuración de la base de datos
$host = "localhost";
$user = "root";
$password = "";
$dbname = "musicmania";

$conexion = @new mysqli($host, $user, $password, $dbname);

if ($conexion->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión con la BD']);
    exit();
}

$conexion->set_charset("utf8mb4");

// Leer la petición JSON
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if ($data) {
    // 1. Extraer datos y asegurarnos de limpiar los tipos
    $producto_id  = isset($data['producto_id']) ? intval($data['producto_id']) : 0;
    $calificacion = isset($data['calificacion']) ? intval($data['calificacion']) : 0;
    $usuario      = (isset($data['usuario']) && trim($data['usuario']) !== '') ? trim($data['usuario']) : 'Anónimo';

    // 2. Gestionar el comentario opcional (cadena limpia sin forzar variable tipo NULL en bind_param)
    $comentario   = isset($data['comentario']) ? trim($data['comentario']) : '';

    // 3. Validar que la calificación esté en el rango de 1 a 5 y el producto sea válido
    if ($producto_id > 0 && $calificacion >= 1 && $calificacion <= 5) {

        $stmt = $conexion->prepare("INSERT INTO resenas (producto_id, usuario, comentario, calificacion) VALUES (?, ?, ?, ?)");

        if ($stmt) {
            $stmt->bind_param("issi", $producto_id, $usuario, $comentario, $calificacion);

            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Reseña guardada exitosamente']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al ejecutar en BD: ' . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error en la sentencia SQL: ' . $conexion->error]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'ID de álbum no válido o calificación ausente']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se recibieron datos válidos']);
}

$conexion->close();
