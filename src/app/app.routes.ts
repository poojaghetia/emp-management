import { NgModule } from '@angular/core';
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employee/new', component: EmployeeFormComponent },
  { path: 'employee/edit/:id', component: EmployeeFormComponent },
];
export const appRoutes = provideRouter(routes);
