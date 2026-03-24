<?php
ob_start();
$allowed_origin = "http://localhost:5173";
header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once '../config/connection.php';
if (ob_get_length()) ob_clean();

// Leemos los datos que vienen de React (JSON)
$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? '';

try {
    switch ($action) {
        case 'create':
            $sql = "INSERT INTO proveedores (nombre, telefono, email) VALUES (?, ?, ?)";
            $stmt = $conexion->prepare($sql);
            $stmt->execute([$data['nombre'], $data['telefono'], $data['email']]);
            echo json_encode(["success" => true, "message" => "Gremio inscrito correctamente"]);
            break;

        case 'update':
            $sql = "UPDATE proveedores SET nombre = ?, telefono = ?, email = ? WHERE id_proveedor = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->execute([$data['nombre'], $data['telefono'], $data['email'], $data['id_proveedor']]);
            echo json_encode(["success" => true, "message" => "Pergamino actualizado"]);
            break;

        case 'delete':
            $sql = "DELETE FROM proveedores WHERE id_proveedor = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->execute([$data['id_proveedor']]);
            echo json_encode(["success" => true, "message" => "Gremio desterrado"]);
            break;

        default:
            throw new Exception("Acción no permitida en este reino");
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}
ob_end_flush();