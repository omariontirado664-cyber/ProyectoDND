<?php
// 1. Iniciamos el buffer para evitar que cualquier espacio en blanco rompa el JSON
ob_start();

// 2. Configuración de CORS para tu puerto de Vite
$allowed_origin = "http://localhost:5173";
header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Si es una petición de control (OPTIONS), salimos rápido
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Desactivamos la impresión de errores directos (se van al log, no al JSON)
ini_set('display_errors', 0);
error_reporting(E_ALL);

try {
    // 3. Importamos tu conexión (Asegúrate de que la ruta sea correcta)
    require_once '../config/connection.php'; 

    // Limpiamos el buffer por si 'connection.php' soltó algún espacio accidental
    if (ob_get_length()) ob_clean();

    // 4. Consulta a la tabla de proveedores (Usando tu variable $conexion)
    $query = "SELECT id_provider, nombre, telefono, email FROM proveedores ORDER BY nombre ASC";
    
    // NOTA: Si en tu tabla el ID se llama 'id_proveedor', cámbialo aquí abajo:
    $stmt = $conexion->prepare("SELECT id_proveedor, nombre, telefono, email FROM proveedores ORDER BY nombre ASC");
    $stmt->execute();

    $proveedores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 5. Enviamos el resultado como JSON
    echo json_encode($proveedores ?: []);

} catch (Exception $e) {
    // Si algo falla, limpiamos y mandamos el error en JSON
    if (ob_get_length()) ob_clean();
    http_response_code(500);
    echo json_encode([
        "error" => "Error en el Censo de Gremios",
        "details" => $e->getMessage()
    ]);
}

// Finalizamos el flujo
ob_end_flush();
exit;
