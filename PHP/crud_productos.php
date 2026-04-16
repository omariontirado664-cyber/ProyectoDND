<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once '../config/connection.php'; 

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? '';

try {
    switch ($action) {
        case 'INSERT':
            $sql = "INSERT INTO productos (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)";
            $stmt = $conexion->prepare($sql);
            $stmt->execute([$data['nombre'], $data['categoria'], $data['precio'], $data['stock']]);
            echo json_encode(["success" => true, "message" => "Artefacto registrado"]);
            break;

        case 'UPDATE':
            $sql = "UPDATE productos SET nombre=?, categoria=?, precio=?, stock=? WHERE id_producto=?";
            $stmt = $conexion->prepare($sql);
            $stmt->execute([$data['nombre'], $data['categoria'], $data['precio'], $data['stock'], $data['id_producto']]);
            echo json_encode(["success" => true, "message" => "Hechizo de actualización completado"]);
            break;

        case 'DELETE':
            $sql = "DELETE FROM productos WHERE id_producto = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->execute([$data['id_producto']]);
            echo json_encode(["success" => true, "message" => "Objeto desvanecido del plano"]);
            break;

        default:
            echo json_encode(["error" => "Acción no permitida"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>