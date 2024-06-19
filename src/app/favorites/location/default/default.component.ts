import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Wing } from '../../../shared/model/wing.model';

@Component({
  selector: 'app-default-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './default.component.html',
})
export class DefaultComponent{
  @Input()
  defaultLocation!: Wing;

  constructor() {}
}
