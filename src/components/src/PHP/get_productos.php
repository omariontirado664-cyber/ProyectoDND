<?php
// 1. Cabeceras obligatorias para React (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Manejo de peticiones pre-flight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// 2. Importar la conexión que ya tienes (la que usa $conexion y PDO)
require_once '../config/connection.php'; 

try {
    // 3. Consulta usando la variable $conexion definida en connection.php
    $sql = "SELECT id_producto, nombre, categoria, precio, stock FROM productos";
    $stmt = $conexion->prepare($sql);
    $stmt->execute();

    $productos = [];

    // 4. Procesar resultados
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Aseguramos que precio y stock sean números para React
        $row['precio'] = (float)$row['precio'];
        $row['stock'] = (int)$row['stock'];
        $productos[] = $row;
    }

    // 5. Enviar JSON
    echo json_encode($productos);

} catch (PDOException $e) {
    // Si hay error en la consulta, avisar a React
    http_response_code(500);
    echo json_encode(["error" => "Fallo en el registro: " . $e->getMessage()]);
}
?>