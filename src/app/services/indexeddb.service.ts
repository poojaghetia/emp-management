import { Injectable } from '@angular/core';
import { openDB, DBSchema } from 'idb';

interface EmployeeDB extends DBSchema {
  employees: {
    key: number;
    value: { id: number; name: string; role: string; startDate: Date; endDate: Date };
  };
}

@Injectable({ providedIn: 'root' })
export class IndexedDBService {
  private dbPromise = openDB<EmployeeDB>('employee-db', 1, {
    upgrade(db) {
      db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
    },
  });

  async addEmployee(employee: Omit<EmployeeDB['employees']['value'], 'id'>) {
    const db = await this.dbPromise;
    const id = await db.add('employees', {
      ...employee,
      id: Date.now()
    });
    return id;
  }

  async updateEmployee(id: number, employee: Omit<EmployeeDB['employees']['value'], 'id'>) {
    const db = await this.dbPromise;
    await db.put('employees', { id, ...employee });
  }

  async deleteEmployee(id: number) {
    const db = await this.dbPromise;
    await db.delete('employees', id);
  }

  async getAllEmployees() {
    const db = await this.dbPromise;
    return db.getAll('employees');
  }
}
