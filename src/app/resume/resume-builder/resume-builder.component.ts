import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeService, SectionType, ResumeSection } from '../resume.service';
import { ResumeSectionComponent } from '../resume-section/resume-section.component';
import { ResumePreviewComponent } from '../resume-preview/resume-preview.component';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ResumeSectionComponent,
    ResumePreviewComponent,
    ButtonComponent,
  ],
  templateUrl: './resume-builder.component.html',
  styleUrls: ['./resume-builder.component.scss'],
})
export class ResumeBuilderComponent {
  private resume = inject(ResumeService);

  sections = this.resume.sections;

  ngOnInit(): void {
    const hasHero = this.sections().some((s) => s.type === 'hero');
    if (!hasHero) {
      this.resume.addSection('hero');
    }
  }

  add(type: SectionType): void {
    this.resume.addSection(type);
  }

  move(id: string, dir: 'up' | 'down'): void {
    this.resume.moveSection(id, dir);
  }

  delete(id: string): void {
    this.resume.removeSection(id);
  }

  trackById(index: number, section: ResumeSection): string {
    return section.id;
  }
}
