<?php
// 1. Cargamos el portero (CORS) y la conexión
require_once '../config/cors.php'; 
require_once '../config/connection.php';

// Desactivamos errores visuales para que no ensucien el JSON
ini_set('display_errors', 0);

// 2. Capturamos los datos de React
$json = file_get_contents("php://input");
$data = json_decode($json);

if (!empty($data->usuario) && !empty($data->password)) {
    // Limpiamos espacios y forzamos que sea texto para que el "001" no falle
    $user = trim((string)$data->usuario);
    $pass = trim((string)$data->password);

    try {
        // Consulta limpia: Sin la columna 'rol' que estaba en NULL
        $sql = "SELECT id_empleado as id, nombre, id_rol, 'empleado' as tipo 
                FROM empleados 
                WHERE CAST(usuario AS CHAR) = :user AND CAST(password AS CHAR) = :pass
                UNION
                SELECT id_cliente as id, nombre, id_rol, 'cliente' as tipo 
                FROM clientes 
                WHERE CAST(usuario AS CHAR) = :user AND CAST(password AS CHAR) = :pass";

        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':user', $user);
        $stmt->bindParam(':pass', $pass);
        $stmt->execute();

        $usuario_data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario_data) {
            // ÉXITO: Acceso concedido a Spider OS
            echo json_encode([
                "success" => true,
                "user" => [
                    "id" => $usuario_data['id'],
                    "nombre" => $usuario_data['nombre'],
                    "id_rol" => (int)$usuario_data['id_rol'],
                    "tipo" => $usuario_data['tipo']
                ]
            ]);
        } else {
            // ERROR: No se encontró el registro con 001 y 123
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Runa de acceso o Identificador incorrectos"]);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error de conexión con la Runa de Datos"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Por favor, completa los campos"]);
}
?>