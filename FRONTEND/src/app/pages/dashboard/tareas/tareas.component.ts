import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ITareas } from '../../../interfaces/itareas.interfaces';


@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css'],
  imports:[FormsModule, CommonModule],
})
export class TareasComponent {
  showModal = false;
  tareas: ITareas[] = [];
  newTask: Partial<ITareas> = {};

  openModal() {
    this.showModal = true;
    this.newTask = {};
  }

  closeModal() {
    this.showModal = false;
  }

  assignTask() {
    if (
      this.newTask.titulo &&
      this.newTask.descripcion &&
      this.newTask.fecha_inicio &&
      this.newTask.fecha_finalizacion &&
      this.newTask.empleado_id
    ) {
      this.tareas.push({
        id: Date.now(),
        titulo: this.newTask.titulo!,
        descripcion: this.newTask.descripcion!,
        empleado_id: this.newTask.empleado_id!,
        fecha_inicio: this.newTask.fecha_inicio!,
        fecha_finalizacion: this.newTask.fecha_finalizacion!,
        estado: 'pendiente' // o el valor por defecto que corresponda
      });
      this.closeModal();
    }
  }

  getTasksByEmployee() {
    const grouped: { [key: string]: ITareas[] } = {};
    this.tareas.forEach((tarea) => {
      if (!grouped[tarea.empleado_id]) grouped[tarea.empleado_id] = [];
      grouped[tarea.empleado_id].push(tarea);
    });
    return grouped;
  }
}