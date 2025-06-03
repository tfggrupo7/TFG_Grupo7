export interface IEmpleados {
    id: number;
    nombre: string;
    pass: string;
    email: string;
    rol_id: number;
    usuario_id: number;
    telefono: string;
    salario: number;
    status: string
    activo: boolean;
    role: IRoles[];
}

export interface IRoles {
    id: number;
    nombre: string;
}
