## API taskrest

### EMPLEADOS

## Recupera todos los empleados

Method: GET
Url : /api/empleados
Headers: XXX
Body: XXX

Response: Un array con todos los empleados

## Recupera un empleado a partir de su ID

METHOD: GET
Url: /api/empleados/<EMPLEADOID>
Headers: XXX
Body: XXX

Response: Un objeto con el empleado pedido
Error Response: status404 + mensaje

## Crear un nuevo empleado

METHOD: POST
Url: /api/empleado
Headers: XXX
Body: nombre, pass, email, rol_id

Response: El objeto creado con los datos del nuevo empleado

## Actualizacion completa de un empleado

METHOD: PUT
Url: /api/empleados/<EMPLEADOID>
Header: XXX
Body:nombre, pass, email, rol_id

Response: Un objeto con los datos del empleado actualizados

### Borrado de un empleado

METHOD: DELETE
Url: /api/empleados<EMPLEADOID>
Headers: XXX
Body: XXX

Response: Un array con los empleados actualizados

### Recuperar todos los empleados con sus tareas

Method: GET
Url: /api/empleados/tareas
Headers: XXX
Body: XXX

Response: 
Json
[
    { "id":1 , "nombre": "juan", "tareas":[{ "descripcion": }]},
    { "id":2 , "nombre": "pedro", "tareas":[{ "descripcion": }]},


]

### TAREAS

## Recupera todos las tareas

Method: GET
Url : /api/tareas
Headers: XXX
Body: XXX

Response: Un array con todas las tareas

## Recupera una tarea a partir de su ID

METHOD: GET
Url: /api/tareas/<TAREAID>
Headers: XXX
Body: XXX

Response: Un objeto conla tarea pedida
Error Response: status404 + mensaje

## Crear una nueva tarea

METHOD: POST
Url: /api/tareas
Headers: XXX
Body: descripcion, empleado_id, menu_id, fecha, empleado_id

Response: El objeto creado con los datos de la nueva tarea

## Actualizacion completa de una tarea

METHOD: PUT
Url: /api/empleados/<TAREAID>
Header: XXX
Body: descripcion, empleado_id, menu_id, fecha, employee_id

Response: Un objeto con los datos del empleado actualizados

### Borrado de una tarea

METHOD: DELETE
Url: /api/tareas<TAREAID>
Headers: XXX
Body: XXX

Response: Un array con las tareas actualizadas

### Recuperar todos las tareas y el empleado a quien pertenece

Method: GET
Url: /api/tareas/empleado/<EMPLEADOID>
Headers: XXX
Body: XXX

Response: 
Json
[
    { "descripcion": , "empleadoId":[{ "id":  , "nombre": , "email": }]},
    { "descripcion": , "empleadoId":[{ "id":  , "nombre": , "email": }]}

]

##############
## USUARIOS ##
##############

### Registrar usuarios
Method: POST
Url : /api/usuarios/registro
Headers: XXX
Body: username, email , password

Response: Los datos del nuevo usuario creado

### Login usuarios
Method: POST
Url : /api/usuarios/login
Headers: XXX
Body: username, password

Response: Login correcto

## Recupera todos los empleados con token
Method: GET
Url: /api/employee
Headers: [authorization]
Body: ###

### Recuperar el perfil de usuario
Method: GET
Url: /api/usuarios/perfil
Headers: [authorization] -> TOKEN
Body: XXX


