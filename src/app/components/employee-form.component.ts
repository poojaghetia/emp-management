import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material/core';

import { EmployeeSignalsService } from '../services/employee-signals.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Employee } from '../models/employee.model';
import {MatSelectModule} from '@angular/material/select';


@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [NgFor ,ReactiveFormsModule, MatDatepickerModule, MatSelectModule,MatInputModule, MatButtonModule, NgIf,MatNativeDateModule],
  template: `
    <form [formGroup]="employeeForm" (ngSubmit)="saveEmployee()">
        <h1>Employee Form</h1>
      <mat-form-field>
        <mat-label>Employee Name</mat-label>
        <input matInput formControlName="name" required>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Role</mat-label> 
        <mat-select formControlName="role" required>
          <mat-option *ngFor="let role of roles" [value]="role">{{ role }}</mat-option>
        </mat-select>
        <!-- <input matInput formControlName="role" required> -->
      </mat-form-field>

      <mat-form-field>
        <mat-label>Start Date</mat-label>
        <input matInput readonly [matDatepicker]="startDatePicker" formControlName="startDate" required>
        <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
        <mat-datepicker #startDatePicker></mat-datepicker>
      </mat-form-field>

      <mat-form-field>
        <mat-label>End Date</mat-label>
        <input matInput readonly [matDatepicker]="endDatePicker" formControlName="endDate"  required>
        <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
        <mat-datepicker #endDatePicker ></mat-datepicker>
      </mat-form-field>

      <button mat-raised-button type="submit" [disabled]="!employeeForm.valid">Save</button>
    </form>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }
    button {
      align-self: flex-end;
    }
  `]
})
export class EmployeeFormComponent {
  employeeService = inject(EmployeeSignalsService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  roles: string[] = ['Manager', 'Developer', 'Designer', 'Tester', 'HR']; // List of roles

  employeeForm = new FormGroup({
    name: new FormControl(''),
    role: new FormControl(''),
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  employeeId: number | null = null;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeId = +id;
      this.loadEmployee();
    }
  }

  async loadEmployee() {
    const employee = this.employeeService.employees().find((e) => e.id === this.employeeId);
    if (employee) {
      this.employeeForm.patchValue({
        name: employee.name,
        role: employee.role,
        startDate: employee.startDate,
        endDate: employee.endDate ,
      });
    }
  }

  async saveEmployee() {
    const formValue = this.employeeForm.value;


  // Transform formValue into the correct Employee type
  const employee: Employee = {
    id: this.employeeId || Date.now(),  // If creating new, generate an ID
    name: formValue.name || '',         // Ensure name is not null or undefined
    role: formValue.role || '',         // Ensure role is not null or undefined
    startDate: formValue.startDate,  // Keep startDate nullable
    endDate: formValue.endDate     // Keep endDate nullable
  };

    if (this.employeeId) {
      await this.employeeService.editEmployee(this.employeeId, employee);
    } else {
      await this.employeeService.addEmployee(employee);
    }
    this.router.navigate(['/employees']);
  }
}
