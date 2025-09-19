import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectItem } from '../resume/resume.service';
import { ButtonComponent } from '../shared/button/button.component';
import {
  TechnologyService,
  TechnologyItem,
} from '../services/technology.service';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.scss',
})
export class ProjectItemComponent {
  @Input({ required: true }) project!: ProjectItem;
  @Output() projectChange = new EventEmitter<ProjectItem>();

  dropdownOpen = false;
  customTech = '';
  customIcon = '';

  availableTechnologies: TechnologyItem[] = [];

  constructor(private techService: TechnologyService) {
    this.availableTechnologies = this.techService.getTechnologies();
  }

  trackByIndex(index: number): number {
    return index;
  }

  changed() {
    this.projectChange.emit(this.project);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  getTechnologiesLabel(): string {
    if (!this.project.technologies?.length) {
      return 'Select technologies';
    }
    return this.project.technologies.map((t) => t.name).join(', ');
  }

  isTechnologySelected(tech: TechnologyItem): boolean {
    return this.project.technologies.some((t) => t.name === tech.name);
  }

  onTechToggle(tech: TechnologyItem, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.project.technologies.some((t) => t.name === tech.name)) {
        this.project.technologies.push(tech);
      }
    } else {
      this.project.technologies = this.project.technologies.filter(
        (t) => t.name !== tech.name
      );
    }

    this.changed();
  }

  addCustomTech() {
    if (!this.customTech?.trim() || !this.customIcon?.trim()) {
      return;
    }
    const techName = this.customTech.trim();
    const iconUrl = this.customIcon.trim();

    if (techName) {
      const newTech: TechnologyItem = {
        name: techName,
        icon: iconUrl || undefined,
      };

      this.techService.addCustomTechnology(newTech);
      this.availableTechnologies = this.techService.getTechnologies();

      if (!this.project.technologies.some((t) => t.name === techName)) {
        this.project.technologies.push(newTech);
      }

      this.changed();
    }

    this.customTech = '';
    this.customIcon = '';
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

// import { CommonModule } from '@angular/common';
// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ProjectItem } from '../resume/resume.service';
// import { ButtonComponent } from '../shared/button/button.component';
// import { TECHNOLOGY } from '../../constants/technology';

// @Component({
//   selector: 'app-project-item',
//   imports: [CommonModule, FormsModule, ButtonComponent],
//   templateUrl: './project-item.component.html',
//   styleUrl: './project-item.component.scss',
// })
// export class ProjectItemComponent {
//   @Input({ required: true }) project!: ProjectItem;
//   @Output() projectChange = new EventEmitter<ProjectItem>();

//   dropdownOpen = false;
//   customTech = '';
//   customIcon = '';

//   availableTechnologies: string[] = Object.keys(TECHNOLOGY);

//   trackByIndex(index: number): number {
//     return index;
//   }

//   changed() {
//     this.projectChange.emit(this.project);
//   }

//   toggleDropdown() {
//     this.dropdownOpen = !this.dropdownOpen;
//   }

//   getTechnologiesLabel(): string {
//     if (!this.project.technologies?.length) {
//       return 'Select technologies';
//     }
//     return this.project.technologies.map((t) => t.name).join(', ');
//   }

//   isTechnologySelected(tech: string): boolean {
//     return this.project.technologies.some((t) => t.name === tech);
//   }

//   onTechToggle(tech: string, event: Event) {
//     const checked = (event.target as HTMLInputElement).checked;

//     if (checked) {
//       if (!this.project.technologies.some((t) => t.name === tech)) {
//         this.project.technologies.push({ name: tech, icon: TECHNOLOGY[tech] });
//       }
//     } else {
//       this.project.technologies = this.project.technologies.filter(
//         (t) => t.name !== tech
//       );
//     }

//     this.changed();
//   }

//   addCustomTech() {
//     const techName = this.customTech.trim();
//     const iconUrl = this.customIcon.trim();

//     if (
//       techName &&
//       !this.project.technologies.some((t) => t.name === techName)
//     ) {
//       this.project.technologies.push({
//         name: techName,
//         icon: iconUrl || undefined,
//       });

//       if (!this.availableTechnologies.includes(techName)) {
//         this.availableTechnologies.push(techName);
//       }

//       this.changed();
//     }

//     this.customTech = '';
//     this.customIcon = '';
//   }

//   addTask() {
//     if (!this.project.tasks) {
//       this.project.tasks = [];
//     }
//     this.project.tasks.push('');
//     this.changed();
//   }

//   removeTask(index: number) {
//     if (this.project.tasks) {
//       this.project.tasks.splice(index, 1);
//       this.changed();
//     }
//   }
// }
