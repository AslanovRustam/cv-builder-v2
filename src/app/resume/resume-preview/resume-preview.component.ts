import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService, ResumeSection } from '../resume.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { TECHNOLOGY } from '../../../constants/technology';

@Component({
  selector: 'app-resume-preview',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './resume-preview.component.html',
  styleUrls: ['./resume-preview.component.scss'],
})
export class ResumePreviewComponent {
  private resume = inject(ResumeService);
  sections = this.resume.sections;

  techIcons: Record<string, string> = TECHNOLOGY;

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  getTechIcon(techName: string, fallbackIcon?: string): string | null {
    return fallbackIcon || this.techIcons[techName] || null;
  }

  trackById(index: number, s: ResumeSection): string {
    return s.id;
  }

  get heroSection(): ResumeSection | undefined {
    return this.sections().find((s) => s.type === 'hero');
  }

  get technologySections() {
    return this.sections().filter((s) => s.type === 'technologies');
  }

  downloadPdf(): void {
    window.print();
  }
}
