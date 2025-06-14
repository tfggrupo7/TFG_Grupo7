export interface IIngredientes {
  id:          number;
  nombre:      string;
  alergenos?:  string | null;
  categoria:   string;
  cantidad:    string;   // llega como "25.00"
  unidad:      string;
  proveedor?:  string | null;
  estado:      string;
  createdAt:   string;   // ISO
  updatedAt:   string;
}
