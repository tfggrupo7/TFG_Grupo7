export interface IIngredientes {
  id:          number;
  nombre:      string;
  alergenos?:  string | null;
  categoria:   string;
  cantidad:    string;   
  unidad:      string;
  proveedor?:  string | null;
  estado:      string;
  createdAt:   string;   
  updatedAt:   string;
  usuario_id?: number;
  empleados_id?: number;
}
