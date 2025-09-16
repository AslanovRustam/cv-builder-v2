import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-position-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './position-select.component.html',
  styleUrls: ['./position-select.component.scss'],
})
export class PositionSelectComponent {
  @Input() position: string | undefined = '';
  @Output() positionChange = new EventEmitter<string>();

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.positionChange.emit(value);
  }
}
