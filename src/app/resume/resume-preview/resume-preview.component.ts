import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import printJS from 'print-js';
import { ResumeService, ResumeSection } from '../resume.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { TECHNOLOGY } from '../../../constants/technology';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

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

  getTechIcon(tech: string): string | null {
    return this.techIcons[tech] ?? null;
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

  // downloadPdf(): void {
  //   if (!this.pdfContent) return;

  //   const element = this.pdfContent.nativeElement;

  //   html2canvas(element, { scale: 3, useCORS: true }).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF('p', 'pt', 'a4');

  //     const imgProps = pdf.getImageProperties(imgData);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //     pdf.save('resume.pdf');
  //   });
  // }
  downloadPdf(): void {
    printJS({
      printable: 'pdfContent',
      type: 'html',
      targetStyles: ['*'],
    });
  }
}
