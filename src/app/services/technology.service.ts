import { Injectable } from '@angular/core';
import { TECHNOLOGY } from '../../constants/technology';
import { BehaviorSubject } from 'rxjs';

export interface TechnologyItem {
  name: string;
  icon?: string;
}

@Injectable({ providedIn: 'root' })
export class TechnologyService {
  private storageKey = 'customTechnologies';
  private technologies$ = new BehaviorSubject<TechnologyItem[]>(
    this.loadTechnologies()
  );

  constructor() {}

  private loadTechnologies(): TechnologyItem[] {
    const stored = localStorage.getItem(this.storageKey);
    const customTechs: TechnologyItem[] = stored ? JSON.parse(stored) : [];

    const baseTechs: TechnologyItem[] = Object.entries(TECHNOLOGY).map(
      ([name, icon]) => ({ name, icon })
    );

    return [...baseTechs, ...customTechs];
  }

  getTechnologiesStream() {
    return this.technologies$.asObservable();
  }

  getTechnologies(): TechnologyItem[] {
    return this.technologies$.value;
  }

  addCustomTechnology(tech: TechnologyItem) {
    const stored = localStorage.getItem(this.storageKey);
    const customTechs: TechnologyItem[] = stored ? JSON.parse(stored) : [];

    if (!customTechs.some((t) => t.name === tech.name)) {
      customTechs.push(tech);
      localStorage.setItem(this.storageKey, JSON.stringify(customTechs));

      this.technologies$.next(this.loadTechnologies());
    }
  }
}
