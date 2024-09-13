import { Component, SecurityContext } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { md } from './app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public title = 'simple-markdown-previewer';
  public form: FormGroup;
  public preview: string | null = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly sanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      editing: '',
    });

    md.linkify.set({ fuzzyEmail: false });

    this.form.get('editing')?.valueChanges.subscribe((input: string) => {
      this.preview = this.sanitizer.sanitize(
        SecurityContext.HTML,
        md.render(input)
      );
    });
  }

  public scrollToAnchor(anchor: string) {
    const element = document.getElementById(anchor);
    element?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}
