export interface IMenus {
    id: number;
    nombre: string;
    ingredientes: Array<{
        id: number;
        nombre: string;
        alergenos: string;
    }>;
    descripcion: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
    activo: boolean;
}
