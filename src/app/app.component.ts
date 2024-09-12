import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public title = 'markdown-previewer';
  public form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      editing: '',
      preview: ''
    })
  }
}
