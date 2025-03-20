import { SessionService } from '../services/session.service';
import { DeviceService } from './../services/device.service';
import {
  Component,
  ElementRef,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { md } from './app.config';
import { HintsComponent } from '../components/hints/hints.component';
import { ActivatedRoute } from '@angular/router';

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
  public preview: string | null = '';
  public isMac: boolean = false;
  public sessionList: string[] = [];
  public selectedIndex = 0;

  public sessionSelect = new FormControl('');
  public userInput: FormControl = new FormControl('');

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly deviceService: DeviceService,
    private readonly sessionService: SessionService,
    private readonly route: ActivatedRoute
  ) {
    this.subscribeToForm();
    this.subscribeToSessionSelect();
    this.subscribeToQueryParams();

    this.disableEmailToLinkConversion();
    this.hideHintPanel();
    this.checkDevice();
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
    this.clear();
  }

  public copy(): void {
    navigator.clipboard.writeText(this.userInput.value);
  }

  public clear(): void {
    this.userInput.setValue('');
  }

  private hideHintPanel(): void {
    this.hintSide?.nativeElement.classList.add('none');
  }

  private disableEmailToLinkConversion(): void {
    md.linkify.set({ fuzzyEmail: false });
  }

  private checkDevice(): void {
    this.isMac = this.deviceService.isMacintosh();
  }

  private subscribeToSessionSelect(): void {
    this.sessionSelect.valueChanges.subscribe((value) => {
      if (value) {
        this.sessionService.restoreSession(value);
      }
    });
  }

  private subscribeToForm(): void {
    this.userInput.valueChanges.subscribe((input: string) => {
      this.preview = this.sanitizer.sanitize(
        SecurityContext.HTML,
        md.render(input)
      );
      this.sessionService.storeSession(input);
    });
  }

  private subscribeToQueryParams(): void {
    this.route.queryParams.subscribe(() => {
      this.userInput.setValue(this.sessionService.formInput);
      this.sessionList = this.sessionService.getSessionList();
      this.selectedIndex = this.getSelectedIndex();
    });
  }

  private getSelectedIndex(): number {
    return this.sessionList.findIndex(
      (listitem) => this.sessionService.sessionKey === listitem
    );
  }
}
