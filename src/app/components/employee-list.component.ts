import { Component, inject } from '@angular/core';
import { EmployeeSignalsService } from '../services/employee-signals.service';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@Component({
    selector: 'app-employee-list',
    standalone: true,
    imports: [NgFor, NgIf, MatButtonModule, CommonModule, MatCardModule],
    template: `
    <div *ngIf="employeeService.employees().length === 0" class="empty-state">
      <p>No employee records found</p>
      <button mat-fab (click)="addEmployee()" style="display: block;
  margin-left: auto;
  margin-right: 0;">+</button>
    </div>

    <div *ngIf="employeeService.employees().length > 0">
    <h1>Employee List</h1>
    
       <ul>
        <li *ngFor="let employee of employeeService.employees()">
        <mat-card appearance="outlined">
        <mat-card-content>
          <p>{{ employee.name }} - {{ employee.role }}</p>
          <p>From: {{ employee.startDate | date }}    To: {{ employee.endDate ? (employee.endDate | date) : 'Present' }}</p>
          <button mat-raised-button (click)="editEmployee(employee.id)">Edit</button>
          <button mat-raised-button (click)="deleteEmployee(employee.id)">Delete</button>
          </mat-card-content>
          </mat-card>
        </li>
       </ul>
       
      
      <button mat-fab (click)="addEmployee()"  style="display: block;
  margin-left: auto;
  margin-right: 0;">+</button>
    </div>
  `,
    styles: [`
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
    }
    button {
      margin-left: 0.5rem;
    }
    @media (max-width: 600px) {
      li {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class EmployeeListComponent {
    employeeService = inject(EmployeeSignalsService);
    router = inject(Router);

    addEmployee() {
        this.router.navigate(['/employee/new']);
    }

    editEmployee(id: number) {
        this.router.navigate(['/employee/edit', id]);
    }

    deleteEmployee(id: number) {
        this.employeeService.deleteEmployee(id);
    }
}
