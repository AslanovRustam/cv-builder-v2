import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeService, ResumeSection } from '../resume.service';

@Component({
  selector: 'app-resume-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resume-section.component.html',
  styleUrls: ['./resume-section.component.scss'],
})
export class ResumeSectionComponent {
  @Input({ required: true }) section!: ResumeSection;

  private resume = inject(ResumeService);

  onTitleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.section.title = input.value;
  }

  onContentChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.section.content = textarea.value;
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
}
