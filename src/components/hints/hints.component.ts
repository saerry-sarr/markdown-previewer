import { Component } from '@angular/core';

@Component({
  selector: 'app-hints',
  templateUrl: './hints.component.html',
  styleUrl: './hints.component.scss',
})
export class HintsComponent {
public flipChevron(chevron: HTMLElement, details: HTMLDetailsElement) {
    document.querySelectorAll('details').forEach((detail) => {
      const chevronElement = detail.querySelector('summary .chevron');
      if (chevronElement && (detail !== details || !detail.open)) {
        chevronElement.classList.remove('flip');
      }
    });
    chevron.classList.toggle('flip');
  }
}
