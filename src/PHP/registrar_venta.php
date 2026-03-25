<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once '../config/connection.php'; 

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['carrito'])) {
    echo json_encode(["success" => false, "message" => "El cofre de venta está vacío."]);
    exit;
}

try {
    $conexion->beginTransaction();

    // 1. Insertar en la tabla 'ventas'
    $sqlVenta = "INSERT INTO ventas (id_cliente, id_empleado, fecha, total) VALUES (?, ?, NOW(), ?)";
    $stmtVenta = $conexion->prepare($sqlVenta);
    $stmtVenta->execute([
        $data['id_cliente'] ?? 1, 
        $data['id_empleado'] ?? 1, 
        $data['total']
    ]);
    
    $idVenta = $conexion->lastInsertId();

    // 2. Preparar sentencias para el detalle y el stock
    $sqlDetalle = "INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)";
    $stmtDetalle = $conexion->prepare($sqlDetalle);

    // Ajuste de ingeniería: Restar stock solo si hay suficiente
    $sqlActualizarStock = "UPDATE productos SET stock = stock - ? WHERE id_producto = ? AND stock >= ?";
    $stmtStock = $conexion->prepare($sqlActualizarStock);

    foreach ($data['carrito'] as $item) {
        // Insertar detalle
        $stmtDetalle->execute([
            $idVenta, 
            $item['id_producto'], 
            $item['cantidad'], 
            $item['precio']
        ]);

        // Intentar descontar del inventario
        $stmtStock->execute([$item['cantidad'], $item['id_producto'], $item['cantidad']]);

        // Si no se actualizó ninguna fila, significa que no había stock suficiente
        if ($stmtStock->rowCount() == 0) {
            throw new Exception("No hay suficiente stock para: " . $item['nombre']);
        }
    }

    $conexion->commit();
    echo json_encode(["success" => true, "message" => "¡Venta sellada y pergaminos actualizados!"]);

} catch (Exception $e) {
    // Si algo falla (incluyendo falta de stock), deshacemos todo
    if ($conexion->inTransaction()) {
        $conexion->rollBack();
    }
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Falla en el sello: " . $e->getMessage()]);
}
?>