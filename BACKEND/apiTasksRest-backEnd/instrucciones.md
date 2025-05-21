## API taskrest

### EMPLOYEES

## Recupera todos los empleados

Method: GET
Url : /api/employees
Headers: XXX
Body: XXX

Response: Un array con todos los empleados

## Recupera un empleado a partir de su ID

METHOD: GET
Url: /api/employees/<EMPLOYEEID>
Headers: XXX
Body: XXX

Response: Un objeto con el empleado pedido
Error Response: status404 + mensaje

## Crear un nuevo empleado

METHOD: POST
Url: /api/employee
Headers: XXX
Body: name, email, username, password, position

Response: El objeto creado con los datos del nuevo empleado

## Actualizacion completa de un empleado

METHOD: PUT
Url: /api/empleados/<EMPLOYEEID>
Header: XXX
Body:name ,email, username, password, position

Response: Un objeto con los datos del empleado actualizados

### Borrado de un empleado

METHOD: DELETE
Url: /api/employees<EMPLOYEEID>
Headers: XXX
Body: XXX

Response: Un array con los empleados actualizados

### Recuperar todos los empleados con sus tareas

Method: GET
Url: /api/employees/tasks
Headers: XXX
Body: XXX

Response: 
Json
[
    { "id":1 , "name": "juan", "tasks":[{ "name":  , "description": }]},
    { "id":2 , "name": "pedro", "tasks":[{ "name":  , "description": }]},


]

### TASKS

## Recupera todos las tareas

Method: GET
Url : /api/tasks
Headers: XXX
Body: XXX

Response: Un array con todas las tareas

## Recupera una tarea a partir de su ID

METHOD: GET
Url: /api/tasks/<TASKID>
Headers: XXX
Body: XXX

Response: Un objeto conla tarea pedida
Error Response: status404 + mensaje

## Crear una nueva tarea

METHOD: POST
Url: /api/task
Headers: XXX
Body: title, description, status, due_date, employee_id

Response: El objeto creado con los datos de la nueva tarea

## Actualizacion completa de una tarea

METHOD: PUT
Url: /api/empleados/<TASKID>
Header: XXX
Body: title, description, status, due_date, employee_id

Response: Un objeto con los datos del empleado actualizados

### Borrado de una tarea

METHOD: DELETE
Url: /api/tasks<TASKEID>
Headers: XXX
Body: XXX

Response: Un array con las tareas actualizadas

### Recuperar todos las tareas y el empleado a quien pertenece

Method: GET
Url: /api/tasks/employee/<EMPLOYEEID>
Headers: XXX
Body: XXX

Response: 
Json
[
    { "name":  , "description": , "employeeId":[{ "id":  , "name": , "email": }]},
    { "name":  , "description": , "employeeId":[{ "id":  , "name": , "email": }]}

]


