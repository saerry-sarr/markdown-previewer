import { Actions } from './../enums/footer-buttons.enum';
import { SessionService } from '../services/session.service';
import { DeviceService } from './../services/device.service';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { md } from './app.config';
import { HintsComponent } from '../components/hints/hints.component';
import { ActivatedRoute } from '@angular/router';
import { ImprintComponent } from '../components/imprint/imprint.component';
import { LegalComponent } from '../components/legal/legal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HintsComponent,
    ImprintComponent,
    LegalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChild('hintSide') public hintSide: ElementRef | undefined;
  @ViewChild('imprintModal') public imprintModal: ElementRef | undefined;
  @ViewChild('legalModal') public legalModal: ElementRef | undefined;
  public preview: string | null = '';
  public isMac: boolean = false;
  public isMobile: boolean = false;
  public sessionList: string[] = [];
  public selectedIndex: number | null = 0;
  public footerElements = ['Imprint', 'Legal Notice', 'Buy Me a Coffee'];

  public sessionSelect = new FormControl('');
  public userInput: FormControl = new FormControl('');

  public imprintModalOpen = false;
  public legalModalOpen = false;
  public Actions = Actions;

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

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  public ngOnInit(): void {
    this.title.setTitle('Simple Markdown Preview | Live Editor & Hints');
    this.meta.addTag({
      name: 'description',
      content:
        "Experience real-time Markdown rendering with this streamlined editor. Switch between sessions, see basic rules, and copy your text in one click. Try now—it's free!",
    });
  }

  public scrollToAnchor(anchor: string): void {
    const element = document.getElementById(anchor);
    element?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  public toggle(): void {
    const hintSideClassList: DOMTokenList =
      this.hintSide?.nativeElement.classList;
    hintSideClassList.toggle('show');
  }

  public triggerNewSession(): void {
    this.sessionService.newSession();
    this.clear();
  }

  public copy(): void {
    navigator.clipboard.writeText(this.userInput.value);
  }

  public clear(): void {
    this.userInput.setValue('');
  }

  public chooseAction(index: number) {
    switch (index) {
      case Actions.imprint: {
        const modal = this.imprintModal?.nativeElement as HTMLDialogElement;
        modal.open ? modal.close() : modal.showModal();
        break;
      }
      case Actions.legalNotice: {
        const modal = this.legalModal?.nativeElement as HTMLDialogElement;
        modal.open ? modal.close() : modal.showModal();
        break;
      }
      case Actions.coffee: {
        window.open('https://paypal.me/serenitystack', '_blank');
        break;
      }
    }
  }

  private hideHintPanel(): void {
    this.hintSide?.nativeElement.classList.add('none');
  }

  private disableEmailToLinkConversion(): void {
    md.linkify.set({ fuzzyEmail: false });
  }

  private checkDevice(): void {
    this.isMac = this.deviceService.isMacintosh();
    this.isMobile = this.deviceService.isTouchDevice();
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
        md.render(input ?? '')
      );
      this.sessionService.storeSession(input ?? '');
    });
  }

  private subscribeToQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      this.userInput.setValue(this.sessionService.formInput);
      this.sessionList = this.sessionService.getSessionList();
      this.selectedIndex = this.getSelectedIndex(params['sessionKey']);
    });
  }

  private getSelectedIndex(sessionKey: string): number {
    if (!sessionKey) {
      return 0;
    }
    const index = this.sessionList.findIndex(
      (listitem) => sessionKey === listitem
    );
    return index === -1 ? 0 : index;
  }
}
