import { Routes } from '@angular/router';
import { ResumeBuilderComponent } from './resume/resume-builder/resume-builder.component';

export const routes: Routes = [
  { path: '', redirectTo: 'resume', pathMatch: 'full' },
  { path: 'resume', component: ResumeBuilderComponent },
  { path: '**', redirectTo: 'resume' },
];
