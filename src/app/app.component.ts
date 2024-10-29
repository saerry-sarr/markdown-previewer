import { SessionService } from '../services/session.service';
import { DeviceService } from './../services/device.service';
import {
  Component,
  ElementRef,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { md } from './app.config';
import { HintsComponent } from '../components/hints/hints.component';
import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, HintsComponent],
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
    private readonly deviceService: DeviceService,
    private readonly sessionService: SessionService
  ) {
    this.form = this.fb.group({
      editing: '',
    });

    this.setUpFormSubscriptions();

    md.linkify.set({ fuzzyEmail: false });

    this.hintSide?.nativeElement.classList.add('none');

    this.isMac = this.deviceService.isMacintosh();
  }

  private setUpFormSubscriptions() {
    this.sessionService.sessionData.subscribe((value) => {
      if (value && !this.form.get('editing')?.value) {
        this.form.get('editing')?.setValue(value);
      }
    });

    this.form.get('editing')?.valueChanges.subscribe((input: string) => {
      this.preview = this.sanitizer.sanitize(
        SecurityContext.HTML,
        md.render(input)
      );
      if (input) {
        this.sessionService.saveSession(input);
      }
    });
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

  public triggerNewSession() {
    this.sessionService.newSession();
    this.form.get('editing')?.setValue('');
  }
}
