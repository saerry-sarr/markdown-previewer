import { DeviceService } from './../services/device.service';
import {
  Component,
  ElementRef,
  OnInit,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { md } from './app.config';
import { HintsComponent } from '../components/hints/hints.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, HintsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('hintSide') public hintSide: ElementRef | undefined;
  public title = 'simple-markdown-previewer';
  public form: FormGroup;
  public preview: string | null = '';
  public isMac: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly sanitizer: DomSanitizer,
    private readonly deviceService: DeviceService
  ) {
    this.form = this.fb.group({
      editing: '',
    });

    md.linkify.set({ fuzzyEmail: false });
    this.hintSide?.nativeElement.classList.add('none');

    this.form.get('editing')?.valueChanges.subscribe((input: string) => {
      this.preview = this.sanitizer.sanitize(
        SecurityContext.HTML,
        md.render(input)
      );
    });

    this.isMac = this.deviceService.isMacintosh();
  }

  public scrollToAnchor(anchor: string) {
    const element = document.getElementById(anchor);
    element?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  public toggle() {
    const hintSideClassList: DOMTokenList =
      this.hintSide?.nativeElement.classList;
    hintSideClassList.toggle('show');
  }
}
