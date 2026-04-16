<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "No se recibieron datos"]);
    exit;
}

$accion = $data['accion'];
$tipo = $data['tipo_sistema']; // 'empleado' o 'cliente'

try {
    // --- ACCIÓN: ELIMINAR ---
    if ($accion === 'eliminar') {
        $tabla = ($tipo === 'empleado') ? 'empleados' : 'clientes';
        $id_col = ($tipo === 'empleado') ? 'id_empleado' : 'id_cliente';
        
        $sql = "DELETE FROM $tabla WHERE $id_col = :id";
        $stmt = $conexion->prepare($sql);
        $stmt->execute(['id' => $data['id_usuario']]);
        echo json_encode(["success" => true, "mensaje" => "Usuario desterrado."]);
    }

    // --- ACCIÓN: GUARDAR (INSERT O UPDATE) ---
    if ($accion === 'guardar') {
        $nombre = $data['nombre'];
        $user = $data['usuario'];
        $pass = $data['password']; 
        $id_rol = $data['id_rol'];
        $id_usuario = $data['id_usuario'] ?? null;

        if ($tipo === 'empleado') {
            if ($id_usuario) {
                $sql = "UPDATE empleados SET nombre=:n, usuario=:u, password=:p, id_rol=:r WHERE id_empleado=:id";
                $params = ['n'=>$nombre, 'u'=>$user, 'p'=>$pass, 'r'=>$id_rol, 'id'=>$id_usuario];
            } else {
                $sql = "INSERT INTO empleados (nombre, usuario, password, id_rol) VALUES (:n, :u, :p, :r)";
                $params = ['n'=>$nombre, 'u'=>$user, 'p'=>$pass, 'r'=>$id_rol];
            }
        } else {
            $email = $data['email'];
            if ($id_usuario) {
                $sql = "UPDATE clientes SET nombre=:n, usuario=:u, password=:p, email=:e, id_rol=:r WHERE id_cliente=:id";
                $params = ['n'=>$nombre, 'u'=>$user, 'p'=>$pass, 'e'=>$email, 'r'=>$id_rol, 'id'=>$id_usuario];
            } else {
                $sql = "INSERT INTO clientes (nombre, usuario, password, email, id_rol) VALUES (:n, :u, :p, :e, :r)";
                $params = ['n'=>$nombre, 'u'=>$user, 'p'=>$pass, 'e'=>$email, 'r'=>$id_rol];
            }
        }
        
        $stmt = $conexion->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["success" => true, "mensaje" => "Registro actualizado en los anales."]);
    }

} catch (PDOException $e) {
    echo json_encode(["error" => true, "mensaje" => $e->getMessage()]);
}
?>