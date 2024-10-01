import { Injectable, signal } from '@angular/core';
import { Employee } from '../models/employee.model';
import { IndexedDBService } from './indexeddb.service';

@Injectable({ providedIn: 'root' })
export class EmployeeSignalsService {
  employees = signal<Employee[]>([]);

  constructor(private indexedDBService: IndexedDBService) {
    this.loadEmployees();
  }

  async loadEmployees() {
    const employees = await this.indexedDBService.getAllEmployees();
    this.employees.set(employees);
  }

  async addEmployee(employee: Employee) {
    const id = await this.indexedDBService.addEmployee(employee);
    this.employees.update((emps) => [...emps, { ...employee, id }]);
  }

  async editEmployee(id: number, employee: Employee) {
    await this.indexedDBService.updateEmployee(id, employee);
    this.employees.update((emps) => emps.map((e) => (e.id === id ? employee : e)));
  }

  async deleteEmployee(id: number) {
    await this.indexedDBService.deleteEmployee(id);
    this.employees.update((emps) => emps.filter((e) => e.id !== id));
  }
}
