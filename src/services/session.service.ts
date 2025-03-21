import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public sessionKey: string = '';
  public formInput: string | null = '';
  public sessionList = [];
  private readonly sessionPrefix = 'session-';
  private readonly sessionListKey = 'sessionList';

  constructor(private readonly route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params: Params) => {
      const sessionKey = params['sessionKey'];
      if (sessionKey) {
        this.sessionKey = sessionKey;
        this.restoreSession(sessionKey);
        this.storeSessionList();
      }
      if (!location.href.includes('session')) {
        this.initializeSession(this.sessionKey);
        this.storeSessionList();
      }
    });
  }

  public restoreSession(sessionKey: string): void {
    if (!sessionKey) {
      return;
    }
    this.formInput = localStorage.getItem(this.sessionPrefix + this.sessionKey);
    this.navigateToActiveSession(sessionKey);
  }

  public newSession(): void {
    this.initializeSession(undefined);
  }

  public storeSession(sessionInput: string | null): void {
    if (!this.sessionKey) {
      return;
    }
    this.formInput = sessionInput ?? '';
    localStorage.setItem(
      this.sessionPrefix + this.sessionKey,
      this.formInput ?? ''
    );
  }

  public getSessionList(): string[] {
    let sessionKeyList = localStorage.getItem(this.sessionListKey);
    return sessionKeyList?.length ? JSON.parse(sessionKeyList) : [];
  }

  private navigateToActiveSession(sessionKey: string): void {
    this.router.navigate([], { queryParams: { sessionKey } });
  }

  private initializeSession(sessionKey: string | undefined): void {
    if (sessionKey) {
      this.restoreSession(sessionKey);
      return;
    }
    this.sessionKey = this.generateRandomString(15);
    this.navigateToActiveSession(this.sessionKey);
    this.storeSession('');
  }

  private generateRandomString(length: number): string {
    const randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  }

  private storeSessionList(): void {
    let sessionKeyList = localStorage.getItem(this.sessionListKey);
    if (!sessionKeyList?.length) {
      sessionKeyList = JSON.stringify([this.sessionKey]);
      localStorage.setItem(this.sessionListKey, sessionKeyList);
      return;
    }
    const parsedList: string[] = JSON.parse(sessionKeyList);
    parsedList.includes(this.sessionKey)
      ? parsedList
      : parsedList.push(this.sessionKey);
    localStorage.setItem(this.sessionListKey, JSON.stringify(parsedList));
  }
}
