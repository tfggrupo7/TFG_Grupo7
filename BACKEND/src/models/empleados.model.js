const db = require("../config/db");
const bcrypt = require("bcryptjs");



const selectAll = async (page, limit) => {
  const [result] = await db.query("select * from empleados ");
  return result;
};
/*const selectAll = async (page, limit) => {
  const [result] = await db.query("select * from empleados limit ? offset ?", [
    limit,
    (page - 1) * limit,
  ]);
  return result;
};*/
const getByEmail = async (email) => {
  const [result] = await db.query(
    "select * from empleados where TRIM(LOWER(email)) = TRIM(LOWER(?))",
    [email]
  );

  if (result.length === 0) return null;

  return result[0];
};

const selectById = async (empleadoId) => {
  const id = Number(empleadoId);
  if (isNaN(id)) {
    throw new Error("ID de empleado no válido");
  }
  const [result] = await db.query("select * from empleados where id = ?", [
    Number(empleadoId),
  ]);
  if (result.length === 0) {
    return null;
  }
  return result[0];
};
const selectByEmpleadoId = async (empleadoId) => {
  const [result] = await db.query(
    "select * from tareas where empleado_id = ?",
    [Number(empleadoId)]
  );
  return result;
};
const selectByTareaId = async (tareaId) => {
  const [result] = await db.query("select * from tareas where id = ?", [
    tareaId,
  ]);
  return result;
};

const insert = async ({ nombre, email, telefono, rol_id, usuario_id, salario, status, activo, fecha_inicio, apellidos }) => {
  const [result] = await db.query(
    "insert into empleados (nombre, email, telefono, rol_id, usuario_id, salario, status, activo, fecha_inicio, apellidos ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [nombre, email, telefono, rol_id, usuario_id, salario, status, activo, fecha_inicio, apellidos]
  );
  return result;
};

const update = async (
  empleadoId,
  { nombre, email, telefono, rol_id, salario, status, activo, fecha_inicio, apellidos }
) => {
  console.log("Actualizando empleado ID:", empleadoId);
  console.log("Datos a actualizar:", {
    nombre, email, telefono, rol_id, salario, status, activo, fecha_inicio, apellidos
  });

  try {
    // Ejecutar la actualización
    const [result] = await db.query(
      "UPDATE empleados SET nombre = ?, email = ?, telefono = ?, rol_id = ?, salario = ?, status = ?, activo = ?, fecha_inicio = ?, apellidos = ? WHERE id = ?",
      [nombre, email, telefono, rol_id, salario, status, activo, fecha_inicio, apellidos, empleadoId]
    );
    
    console.log("Filas afectadas:", result.affectedRows);
    
    if (result.affectedRows === 0) {
      throw new Error("No se encontró el empleado o no se pudo actualizar");
    }
    
    // IMPORTANTE: Consultar y devolver el empleado actualizado
    const [updatedRows] = await db.query(
      "SELECT * FROM empleados WHERE id = ?",
      [empleadoId]
    );
    
    console.log("Empleado actualizado:", updatedRows[0]);
    return updatedRows[0];
    
  } catch (error) {
    console.error("Error en actualización:", error);
    throw error;
  }
};

const updateEmpleadoPerfil = async (
  empleadoId,
  { nombre, email, apellidos }
) => {
    const [result] = await db.query(
      "update empleados set nombre = ?,  email = ?, apellidos =? where id = ?",
      [nombre, email, apellidos,empleadoId]
    );
    return result;
  };



const remove = async (empleadoId) => {
  const [result] = await db.query("delete from empleados where id = ?", [
    empleadoId,
  ]);
  return result;
};

const empleadosYroles = async () => {
  let { limit, offset } = req.query;

// Convierte a número y pon valores por defecto si no están definidos
limit = Number(limit) || 10;    // Por ejemplo, 10 por defecto
offset = Number(offset) || 0;   // 0 por defecto

const [result] = await db.query(
  "SELECT e.*, r.nombre AS rol FROM empleados e JOIN roles r ON e.rol_id = r.id LIMIT ? OFFSET ?",
  [limit, offset]
);
};
const guardarTokenRecuperacion = async (email, tokenHash, expires) => {
  const [result] = await db.query(
    "UPDATE empleados SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?",
    [tokenHash, expires, email]
  );
  return result.affectedRows > 0;
};

const recuperarContraseña = async (email, token, expires) => {
  console.log("Intentando guardar token para:", email, token, expires);
  const [result] = await db.query("SELECT * FROM empleados WHERE email = ?", [
    email,
  ]);
  if (result.length === 0) {
    console.log("No existe empleado con ese email");
    return null;
  }
  const updateResult = await db.query(
    "UPDATE  empleados SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?",
    [token, expires, email]
  );
  console.log("Resultado del UPDATE:", updateResult);
  return true;
};

const updateContraseñaPorToken = async (tokenPlano, nuevaContraseña) => {
  const [rows] = await db.query(
    "SELECT id, reset_password_token FROM empleados WHERE reset_password_token IS NOT NULL AND reset_password_expires > NOW()"
  );
console.log(rows.map(r => ({
  id: r.id,
  expires: r.reset_password_expires
})));
  let empleado = null;
  for (const row of rows) {
    console.log('Comparando token:', tokenPlano, 'con hash:', row.reset_password_token);
    const match = await bcrypt.compareSync(tokenPlano, row.reset_password_token);
    console.log('Resultado de la comparación:', match);
    if (match)  {
      empleado = row;
      break;
    }
  }

  if (!empleado) {
    return null;
  }

  const hashedPassword = await bcrypt.hashSync(nuevaContraseña, 10);

  await db.query(
    "UPDATE empleados SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?",
    [hashedPassword, empleado.id]
  );

  return empleado;
};
const cambiarContraseña = async (empleadoId, nuevaContraseña) => {
 if (!nuevaContraseña || typeof nuevaContraseña !== "string") {
    throw new Error("La nueva contraseña es obligatoria.");
  }
  const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);
  const [result] = await db.query(
    "UPDATE empleados SET password = ? WHERE id = ?",
    [hashedPassword, empleadoId]
  );
  return result;
}

module.exports = {
  selectAll,
  selectById,
  selectByEmpleadoId,
  selectByTareaId,
  insert,
  update,
  remove,
  empleadosYroles,
  guardarTokenRecuperacion,
  recuperarContraseña,
  updateContraseñaPorToken,
  getByEmail,
  updateEmpleadoPerfil,
  cambiarContraseña
};
