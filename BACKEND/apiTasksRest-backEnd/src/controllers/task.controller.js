const Task = require("../models/tasks.model");
const Employee = require("../models/employees.model");
const { generateTasksPDF } = require('../helper/pdf.helper');
const { sendTasksEmail } = require('../helper/email.helper');
const path = require('path');
const fs = require('node:fs');

const getTasksById = async (req, res) => {
  const { taskId } = req.params;
  const tasks = await Task.selectByTaskId(taskId);
  res.json(tasks);
};

const getAllTasks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const tasks = await Task.selectAllTasks(Number(page), Number(limit));
  res.json({
    page: Number(page),
    limit: Number(limit),
    total: tasks.length,
    data: tasks,
  });
};

const getTasksAndEmployee = async (req, res) => {
  const tasks = await Task.selectAllTasks(1, 500);

  for (let task of tasks) {
    const employee = await Employee.selectById(task.employee_id);
    if (employee) {
      task.employee = {
        name: employee.name,
        email: employee.email,
        username: employee.username,
        password: employee.password,
        position: employee.position,
      };
    } else {
      task.employee = null;
    }
  }

  res.json(task);
};

const getTasksAndEmployeeById = async (req, res) => {
  const { employeeId } = req.params;
  const tasks = await Task.selectByEmployeeId(employeeId);
  const employee = await Employee.selectById(employeeId);

  if (!tasks) {
    return res.status(404).send("No se encontraron las tareas para este empleado");
  }

  for (let task of tasks) {
    task.employee = {
        name: employee.name,
        email: employee.email,
        username: employee.username,
        password: employee.password,
        position: employee.position,
    };
  }

  res.json(tasks);
}
const createTask = async (req, res) => {
  const { title,description,status,due_date,employee_id } = req.body;
  const result= await Task.insert(title,description,status,due_date,employee_id);
  const task = await Task.selectByTaskId(result.insertId);

  res.json(task);
};

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const result = await Task.update(taskId, req.body);
  const { title, description, status, due_date, employee_id } = req.body;
  const task = await Task.selectByTaskId(taskId);

    res.json(task);
};

const removeTask = async (req, res) => {
  const { taskId } = req.params;
  const result = await Task.remove(taskId);
  const tasks = await Post.selectAllTasks(1, 1000);

  res.json({ message: "Tarea eliminada ", data: tasks });
};

// tareas para el pdf
const getAllTasksRaw = async () => {
  return await Task.selectAllTasksRaw();
};

const exportTasksPDF = async (req, res) => {
  console.log('Entrando a exportTasksPDF');
  try {
    const tasks = await Task.selectAllTasksRaw();
    const pdfDir = path.join(__dirname, 'pdfs');
    const filePath = path.join(pdfDir, 'tasks.pdf');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir);
    }
    // Generar el PDF
    console.log('Generando PDF en:', filePath);
    await generateTasksPDF(tasks, filePath);
    console.log('PDF generado');
    res.download(filePath, 'tasks.pdf', (err) => {
      if (err) {
        console.error('Error al enviar el PDF:', err);
      }
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error al borrar el PDF:', err);
      });
    });
  } catch (err) {
    console.error('Error al generar el PDF:', err);
    res.status(500).json({ error: 'Error al generar el PDF', details: err.message });
  }
};
// Generacion de pdf de tareas por empleado

const getAllTasksEmployeeRaw = async (employeeId) => {
  return await Task.selectAllTasksAndEmployeeRaw(employeeId);
};
/*const exportTasksEmployeePDF = async (req, res) => {
  console.log('Entrando a exportTasksEmployeePDF');
  const { employeeId } = req.params;
  try {
    const tasks = await Task.selectAllTasksAndEmployeeRaw (employeeId);
    const pdfDir = path.join(__dirname, 'pdfs');
    const filePath = path.join(pdfDir, 'tasks.pdf');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir);
    }
    // Generar el PDF
    console.log('Generando PDF en:', filePath);
    await generateTasksPDF(tasks, filePath);
    console.log('PDF generado');
    res.download(filePath, 'tasks.pdf', (err) => {
      if (err) {
        console.error('Error al enviar el PDF:', err);
      }
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error al borrar el PDF:', err);
      });
    });
  } catch (err) {
    console.error('Error al generar el PDF:', err);
    res.status(500).json({ error: 'Error al generar el PDF', details: err.message });
  }
};*/
const exportTasksEmployeePDF = async (req, res) => {
  console.log('Entrando a exportTasksEmployeePDF');
  const { employeeId } = req.params;

  try {
    const tasks = await Task.selectAllTasksAndEmployeeRaw(employeeId);

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: 'No se encontraron tareas para este empleado' });
    }

    const pdfDir = path.join(__dirname, 'pdfs');
    const filePath = path.join(pdfDir, `tasks_emp_${employeeId}.pdf`);

    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    console.log('Generando PDF en:', filePath);
    await generateTasksPDF(tasks, filePath);
    console.log('PDF generado');

    res.download(filePath, `employee_${employeeId}_tasks.pdf`, (err) => {
      if (err) {
        console.error('Error al enviar el PDF:', err);
        return res.status(500).json({ error: 'Error al enviar el archivo PDF' });
      }
      // Eliminar el archivo temporal luego de enviarlo
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error al borrar el archivo PDF:', err);
      });
    });
  } catch (err) {
    console.error('Error al generar el PDF:', err);
    res.status(500).json({ error: 'Error al generar el PDF', details: err.message });
  }
};


// Envio de todas las tareas por email
const sendTaskPDF = async (req, res) => {
  console.log('Enviando PDF por email');
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requerido' });

  try {
    const tasks = await Task.selectAllTasksRaw();
    console.log('Tareas obtenidas:', tasks.length);
    const filePath = path.join(__dirname, 'tasks.pdf');
    console.log('PDF generado en:', filePath);
    await generateTasksPDF(tasks, filePath);
    await sendTasksEmail(email, 'Lista de Tareas', 'Adjunto encontrarás el PDF con las tareas.', filePath);
    console.log('Email enviado a:', email);

    fs.unlinkSync(filePath);
    res.json({ message: 'Email enviado correctamente' });
  } catch (err) {
    console.error('Error al enviar el email:', err);
    res.status(500).json({ error: 'Error al enviar el email' });
  }
};
// Envio tareas por email de un empleado

const sendAllTaskEmployeePDF = async (req, res) => {
  console.log('Enviando PDF por email');
  const { email } = req.body;
  const  employeeId = Number(req.params.employeeId);

  try {
    const tasks = await Task.selectAllTasksAndEmployeeRaw(employeeId);

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: 'No se encontraron tareas para este empleado' });
    }

    const filePath = path.join(__dirname, `tasks_emp_${employeeId}.pdf`);
    console.log('Generando PDF en:', filePath);

    await generateTasksPDF(tasks, filePath);

    await sendTasksEmail(
      email,
      'Lista de Tareas',
      'Adjunto encontrarás el PDF con las tareas.',
      filePath
    );

    console.log('Email enviado a:', email);

    fs.unlinkSync(filePath);

    res.json({ message: 'Email enviado correctamente' });
  } catch (err) {
    console.error('Error al enviar el email:', err);
    res.status(500).json({ error: 'Error al enviar el email', details: err.message });
  }
};



module.exports = {
  getTasksById,
  getAllTasks,
  createTask,
  updateTask,
  removeTask,
  getTasksAndEmployee,
  getTasksAndEmployeeById,
  getAllTasksRaw,exportTasksPDF,sendTaskPDF,sendAllTaskEmployeePDF,
  getAllTasksEmployeeRaw,exportTasksEmployeePDF
  
};
