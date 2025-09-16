import { Injectable, effect, signal } from '@angular/core';
import { Language } from '../../interfaces/language.interface';
import { Levels } from '../../enums/language-levels.enum';

export type SectionType =
  | 'hero'
  | 'summary'
  | 'education'
  | 'skills'
  | 'projects'
  | 'contacts'
  | 'custom'
  | 'language'
  | 'technologies';

export interface TechnologyItem {
  name: string;
  icon?: string;
}

export interface ProjectItem {
  projectName: string;
  role: string;
  period: { start: string; end: string };
  description: string;
  technologies: string[];
  tasks?: string[];
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  avatarUrl?: string;
  companyLogoUrl?: string;
  position?: string;
  projects?: ProjectItem[];
  languages?: Language[];
  technologies?: string[];
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

    const isFirstProject =
      type === 'projects' &&
      !this._sections().some((s) => s.type === 'projects');

    const newSection: ResumeSection = {
      id,
      type,
      title: this.defaultTitle(type, isFirstProject),
      content: '',
      ...(type === 'projects'
        ? {
            projects: [
              {
                projectName: '',
                role: '',
                period: { start: '', end: '' },
                description: '',
                technologies: [],
              },
            ],
          }
        : {}),
      ...(type === 'language'
        ? {
            languages: [
              {
                name: '',
                level: Levels.beginner,
              },
            ],
          }
        : {}),
      ...(type === 'technologies'
        ? {
            technologies: [],
          }
        : {}),
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

  private defaultTitle(type: SectionType, isFirstProject = true): string {
    switch (type) {
      case 'hero':
        return 'Type BIO';
      case 'summary':
        return 'About me:';
      case 'education':
        return 'Education:';
      case 'skills':
        return 'Skills:';
      case 'projects':
        return isFirstProject ? 'Experience:' : '';
      case 'contacts':
        return 'Contacts:';
      case 'language':
        return 'Languages:';
      case 'technologies':
        return 'Tools/Technologies:';
      default:
        return 'Custom section';
    }
  }
}

// import { Injectable, effect, signal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { Language } from '../../interfaces/language.interface';
// import { Levels } from '../../enums/language-levels.enum';

// export type SectionType =
//   | 'hero'
//   | 'summary'
//   | 'education'
//   | 'skills'
//   | 'projects'
//   | 'contacts'
//   | 'custom'
//   | 'language'
//   | 'technologies';

// export interface ProjectItem {
//   projectName: string;
//   role: string;
//   period: { start: string; end: string };
//   description: string;
//   technologies: string[];
//   tasks?: string[];
// }

// export interface ResumeSection {
//   id: string;
//   type: SectionType;
//   title: string;
//   content: string;
//   avatarUrl?: string;
//   companyLogoUrl?: string;
//   position?: string;
//   projects?: ProjectItem[];
//   languages?: Language[];
//   technologies?: string[];
// }

// // const STORAGE_KEY = 'cv_builder_v2';

// @Injectable({ providedIn: 'root' })
// export class ResumeService {
//   private apiUrl = 'http://localhost:4000/sections';
//   private _sections = signal<ResumeSection[]>([]);
//   readonly sections = this._sections.asReadonly();

//   // private _sections = signal<ResumeSection[]>(this.load());

//   // readonly sections = this._sections.asReadonly();

//   // constructor() {
//   //   effect(() => {
//   //     const data = this._sections();
//   //     try {
//   //       localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
//   //     } catch {
//   //       console.log(`no data with key ${STORAGE_KEY}`);
//   //     }
//   //   });
//   // }
//   constructor(private http: HttpClient) {}

//   // private load(): ResumeSection[] {
//   //   try {
//   //     const raw = localStorage.getItem(STORAGE_KEY);
//   //     return raw ? (JSON.parse(raw) as ResumeSection[]) : [];
//   //   } catch {
//   //     return [];
//   //   }
//   // }
//   loadSections(): void {
//     this.http
//       .get<ResumeSection[]>(this.apiUrl)
//       .subscribe((data) => this._sections.set(data));
//   }

//   // addSection(type: SectionType): void {
//   //   const id =
//   //     typeof crypto !== 'undefined' && 'randomUUID' in crypto
//   //       ? crypto.randomUUID()
//   //       : String(Date.now() + Math.random());

//   //   const isFirstProject =
//   //     type === 'projects' &&
//   //     !this._sections().some((s) => s.type === 'projects');

//   //   const newSection: ResumeSection = {
//   //     id,
//   //     type,
//   //     title: this.defaultTitle(type, isFirstProject),
//   //     content: '',
//   //     ...(type === 'projects'
//   //       ? {
//   //           projects: [
//   //             {
//   //               projectName: '',
//   //               role: '',
//   //               period: { start: '', end: '' },
//   //               description: '',
//   //               technologies: [],
//   //             },
//   //           ],
//   //         }
//   //       : {}),
//   //     ...(type === 'language'
//   //       ? {
//   //           languages: [
//   //             {
//   //               name: '',
//   //               level: Levels.beginner,
//   //             },
//   //           ],
//   //         }
//   //       : {}),
//   //     ...(type === 'technologies'
//   //       ? {
//   //           technologies: [],
//   //         }
//   //       : {}),
//   //   };

//   //   this._sections.update((arr) => [...arr, newSection]);
//   // }
//   addSection(type: SectionType) {
//     const section: Omit<ResumeSection, 'id'> = {
//       type,
//       title: this.defaultTitle(type),
//       content: '',
//       technologies: type === 'technologies' ? [] : undefined,
//       languages:
//         type === 'language'
//           ? [{ name: '', level: Levels.beginner }]
//           : undefined,
//       projects:
//         type === 'projects'
//           ? [
//               {
//                 projectName: '',
//                 role: '',
//                 period: { start: '', end: '' },
//                 description: '',
//                 technologies: [],
//               },
//             ]
//           : undefined,
//     };

//     this.http
//       .post<ResumeSection>(this.apiUrl, section)
//       .pipe(
//         tap((newSection) =>
//           this._sections.update((arr) => [...arr, newSection])
//         )
//       )
//       .subscribe();
//   }

//   // updateSection(id: string, patch: Partial<ResumeSection>): void {
//   //   this._sections.update((arr) =>
//   //     arr.map((s) => (s.id === id ? { ...s, ...patch } : s))
//   //   );
//   // }
//   updateSection(id: string, patch: Partial<ResumeSection>): Observable<any> {
//     return this.http
//       .put(`${this.apiUrl}/${id}`, patch)
//       .pipe(
//         tap(() =>
//           this._sections.update((arr) =>
//             arr.map((s) => (s.id === id ? { ...s, ...patch } : s))
//           )
//         )
//       );
//   }

//   // removeSection(id: string): void {
//   //   this._sections.update((arr) => arr.filter((s) => s.id !== id));
//   // }
//   removeSection(id: string): Observable<any> {
//     return this.http
//       .delete(`${this.apiUrl}/${id}`)
//       .pipe(
//         tap(() =>
//           this._sections.update((arr) => arr.filter((s) => s.id !== id))
//         )
//       );
//   }

//   moveSection(id: string, direction: 'up' | 'down'): void {
//     this._sections.update((arr) => {
//       const index = arr.findIndex((s) => s.id === id);
//       if (index === -1) return arr;
//       const target = direction === 'up' ? index - 1 : index + 1;
//       if (target < 0 || target >= arr.length) return arr;
//       const copy = [...arr];
//       [copy[index], copy[target]] = [copy[target], copy[index]];
//       return copy;
//     });
//   }

//   private defaultTitle(type: SectionType, isFirstProject = true): string {
//     switch (type) {
//       case 'hero':
//         return 'Type BIO';
//       case 'summary':
//         return 'About me:';
//       case 'education':
//         return 'Education:';
//       case 'skills':
//         return 'Skills:';
//       case 'projects':
//         return isFirstProject ? 'Experience:' : '';
//       case 'contacts':
//         return 'Contacts:';
//       case 'language':
//         return 'Languages:';
//       case 'technologies':
//         return 'Tools/Technologies:';
//       default:
//         return 'Custom section';
//     }
//   }
// }
