<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once '../config/connection.php'; 

try {
    // Consulta mística a la tabla de gremios
    $query = "SELECT id_proveedor, nombre, telefono, email FROM proveedores ORDER BY nombre ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $proveedores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Si no hay nada, mandamos un array vacío
    echo json_encode($proveedores ?: []);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al consultar los registros: " . $e->getMessage()]);
}
?>