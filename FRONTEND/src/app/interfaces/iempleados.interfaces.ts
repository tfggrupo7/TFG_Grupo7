export interface IEmpleados {
    id: number;
    nombre: string;
    apellidos: string;
    password?: string;
    email: string;
    rol_id: number;
    fecha_inicio: string;
    telefono: string;
    salario: number;
    status: string
    activo: boolean;
    usuario_id?: number;
    role: IRol[];
}

export interface IRol {
  id: number;
  nombre: string;
}