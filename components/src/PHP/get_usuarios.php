<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Cargamos tu conexión que ya usa PDO
require_once '../config/connection.php'; 

try {
    /**
     * Usamos la variable $conexion que definiste en connection.php
     * La consulta UNION está ajustada a tus tablas reales:
     * 'empleados' no tiene email, 'clientes' sí.
     */
    $query = "
        SELECT 
            e.id_empleado AS id_usuario, 
            e.nombre, 
            r.nombre_rol AS rol, 
            'empleado' AS tipo_sistema,
            'No registrado' AS email 
        FROM empleados e
        INNER JOIN roles r ON e.id_rol = r.id_rol
        
        UNION ALL
        
        SELECT 
            c.id_cliente AS id_usuario, 
            c.nombre, 
            r.nombre_rol AS rol, 
            'cliente' AS tipo_sistema,
            c.email 
        FROM clientes c
        INNER JOIN roles r ON c.id_rol = r.id_rol
    ";

    $stmt = $conexion->prepare($query);
    $stmt->execute();
    
    // Obtenemos todos los registros como un array asociativo
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Enviamos el resultado a React
    echo json_encode($usuarios);

} catch (PDOException $e) {
    // Si algo falla, enviamos el error exacto para que lo veas en la consola de React
    http_response_code(500);
    echo json_encode([
        "error" => true, 
        "mensaje" => "Error en el Censo: " . $e->getMessage()
    ]);
}
?>