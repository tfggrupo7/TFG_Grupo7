export interface IInventarioResumen {
  total_productos: number;
  productos_bajo_stock: number;
  categorias: number;
  proveedores: number;
  ultima_actualizacion: Date;
  categoria_mas_usada: string;
}
