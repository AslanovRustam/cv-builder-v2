import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeService, ResumeSection, ProjectItem } from '../resume.service';
import { PositionSelectComponent } from '../../shared/position-select/position-select.component';
import { ProjectItemComponent } from '../../project-item/project-item.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { Levels } from '../../../enums/language-levels.enum';
import { TECHNOLOGY } from '../../../constants/technology';

@Component({
  selector: 'app-resume-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PositionSelectComponent,
    ProjectItemComponent,
    ButtonComponent,
  ],
  templateUrl: './resume-section.component.html',
  styleUrls: ['./resume-section.component.scss'],
})
export class ResumeSectionComponent {
  @Input({ required: true }) section!: ResumeSection;

  Levels = Levels;
  technologyMap = TECHNOLOGY;
  technologyKeys = Object.keys(TECHNOLOGY);
  newTech = '';

  private resume = inject(ResumeService);

  onTitleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.section.title = input.value;

    this.resume.updateSection(this.section.id, { title: input.value });
  }

  onContentChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.section.content = textarea.value;

    this.resume.updateSection(this.section.id, { content: textarea.value });
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.section.avatarUrl = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onCompanyLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.resume.updateSection(this.section.id, {
          companyLogoUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onPositionChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.section.position = select.value;

    this.resume.updateSection(this.section.id, { position: select.value });
  }

  onProjectChange(index: number, project: ProjectItem): void {
    if (this.section.projects) {
      this.section.projects[index] = project;
      this.resume.updateSection(this.section.id, {
        projects: this.section.projects,
      });
    }
  }

  addProject(): void {
    if (!this.section.projects) this.section.projects = [];
    this.section.projects.push({
      projectName: '',
      role: '',
      period: { start: '', end: '' },
      description: '',
      technologies: [],
    });
    this.resume.updateSection(this.section.id, {
      projects: this.section.projects,
    });
  }

  moveProject(index: number, dir: 'up' | 'down') {
    if (!this.section.projects) return;

    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= this.section.projects.length) return;

    [this.section.projects[index], this.section.projects[target]] = [
      this.section.projects[target],
      this.section.projects[index],
    ];

    this.resume.updateSection(this.section.id, {
      projects: this.section.projects,
    });
  }

  deleteProject(index: number) {
    if (!this.section.projects) return;

    this.section.projects.splice(index, 1);
    this.resume.updateSection(this.section.id, {
      projects: this.section.projects,
    });
  }

  updateLanguage(
    index: number,
    field: 'name' | 'level',
    value: string | Levels
  ) {
    if (!this.section.languages) return;

    if (field === 'level') {
      this.section.languages[index][field] = value as Levels;
    } else {
      this.section.languages[index][field] = value as string;
    }

    this.resume.updateSection(this.section.id, {
      languages: this.section.languages,
    });
  }

  addLanguage() {
    if (!this.section.languages) {
      this.section.languages = [];
    }
    this.section.languages = [
      ...this.section.languages,
      { name: '', level: Levels.beginner },
    ];

    this.resume.updateSection(this.section.id, {
      languages: this.section.languages,
    });
  }

  deleteLanguage(index: number) {
    if (!this.section.languages) return;

    this.section.languages.splice(index, 1);
    this.resume.updateSection(this.section.id, {
      languages: this.section.languages,
    });
  }

  updateTechnologies(techs: string[]) {
    this.section.technologies = techs;
    this.resume.updateSection(this.section.id, { technologies: techs });
  }

  onTechToggle(tech: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (!this.section.technologies) {
      this.section.technologies = [];
    }

    if (checked) {
      this.section.technologies = [...this.section.technologies, tech];
    } else {
      this.section.technologies = this.section.technologies.filter(
        (t) => t !== tech
      );
    }

    this.resume.updateSection(this.section.id, {
      technologies: this.section.technologies,
    });
  }

  addTechnology() {
    const tech = this.newTech.trim();
    if (!tech) return;

    if (!this.section.technologies) {
      this.section.technologies = [];
    }

    if (!this.section.technologies.includes(tech)) {
      this.section.technologies.push(tech);
      this.resume.updateSection(this.section.id, {
        technologies: this.section.technologies,
      });
    }

    // Добавляем в общие ключи, чтобы чекбоксы появились
    if (!this.technologyKeys.includes(tech)) {
      this.technologyKeys.push(tech);
    }

    this.newTech = '';
  }

  removeTechnology(tech: string) {
    if (!this.section.technologies) return;

    this.section.technologies = this.section.technologies.filter(
      (t) => t !== tech
    );
    this.resume.updateSection(this.section.id, {
      technologies: this.section.technologies,
    });
  }
}
