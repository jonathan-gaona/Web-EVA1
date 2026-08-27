<?php
header('Content-Type: application/json; charset=utf-8');

$host = "localhost";
$user = "root";
$password = "";
$dbname = "musicmania";

$conexion = new mysqli($host, $user, $password, $dbname);

if ($conexion->connect_error) {
    echo json_encode([]);
    exit();
}

$sql = "SELECT producto_id, usuario, calificacion, comentario, DATE_FORMAT(fecha, '%d/%m/%Y') AS fecha 
        FROM resenas 
        ORDER BY id DESC";

$resultado = $conexion->query($sql);

$resenas = array();

if ($resultado && $resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $resenas[] = $fila;
    }
}

echo json_encode($resenas, JSON_UNESCAPED_UNICODE);

$conexion->close();
