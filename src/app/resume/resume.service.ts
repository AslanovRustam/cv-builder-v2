import { Injectable, effect, signal } from '@angular/core';

export type SectionType =
  | 'hero'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'contacts'
  | 'custom';

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  avatarUrl?: string;
  companyLogoUrl?: string;
}

const STORAGE_KEY = 'cv_builder_v2';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private _sections = signal<ResumeSection[]>(this.load());

  readonly sections = this._sections.asReadonly();

  constructor() {
    effect(() => {
      const data = this._sections();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        console.log(`no data with key ${STORAGE_KEY}`);
      }
    });
  }

  private load(): ResumeSection[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ResumeSection[]) : [];
    } catch {
      return [];
    }
  }

  addSection(type: SectionType): void {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : String(Date.now() + Math.random());

    const newSection: ResumeSection = {
      id,
      type,
      title: this.defaultTitle(type),
      content: '',
    };

    this._sections.update((arr) => [...arr, newSection]);
  }

  updateSection(id: string, patch: Partial<ResumeSection>): void {
    this._sections.update((arr) =>
      arr.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  }

  removeSection(id: string): void {
    this._sections.update((arr) => arr.filter((s) => s.id !== id));
  }

  moveSection(id: string, direction: 'up' | 'down'): void {
    this._sections.update((arr) => {
      const index = arr.findIndex((s) => s.id === id);
      if (index === -1) return arr;
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return arr;
      const copy = [...arr];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  private defaultTitle(type: SectionType): string {
    switch (type) {
      case 'hero':
        return 'Personal data';
      case 'summary':
        return 'About me';
      case 'experience':
        return 'Experience';
      case 'education':
        return 'Education';
      case 'skills':
        return 'Skills';
      case 'projects':
        return 'Projects';
      case 'contacts':
        return 'Contacts';
      default:
        return 'Custom section';
    }
  }
}
