import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectItem } from '../resume/resume.service';
import { ButtonComponent } from '../shared/button/button.component';
import { TECHNOLOGY } from '../../constants/technology';

@Component({
  selector: 'app-project-item',
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.scss',
})
export class ProjectItemComponent {
  @Input({ required: true }) project!: ProjectItem;
  @Output() projectChange = new EventEmitter<ProjectItem>();

  dropdownOpen = false;
  customTech = '';

  availableTechnologies: string[] = Object.keys(TECHNOLOGY);

  trackByIndex(index: number): number {
    return index;
  }

  changed() {
    this.projectChange.emit(this.project);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onTechToggle(tech: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.project.technologies.includes(tech)) {
        this.project.technologies.push(tech);
      }
    } else {
      this.project.technologies = this.project.technologies.filter(
        (t) => t !== tech
      );
    }
    this.changed();
  }

  addCustomTech() {
    const tech = this.customTech.trim();
    if (tech && !this.project.technologies.includes(tech)) {
      this.project.technologies.push(tech);
      if (!this.availableTechnologies.includes(tech)) {
        this.availableTechnologies.push(tech);
      }
      this.changed();
    }
    this.customTech = '';
  }

  addTask() {
    if (!this.project.tasks) {
      this.project.tasks = [];
    }
    this.project.tasks.push('');
    this.changed();
  }

  removeTask(index: number) {
    if (this.project.tasks) {
      this.project.tasks.splice(index, 1);
      this.changed();
    }
  }
}
