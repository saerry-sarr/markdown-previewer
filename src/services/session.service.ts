import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public sessionKey: string = '';
  public formInput: string | null = '';
  public sessionList = [];
  private sessionPrefix = 'session-';
  private sessionListKey = 'sessionList';

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

  private initializeSession(sessionKey: string | undefined): void {
    if (sessionKey) {
      this.restoreSession(sessionKey);
      return;
    }
    this.sessionKey = this.getSessionKey();
    this.navigateToActiveSession(this.sessionKey);
    this.storeSession('');
  }

  private getSessionKey(): string {
    return this.generateRandomString(15);
  }

  public restoreSession(sessionKey: string): void {
    if (!sessionKey) {
      return;
    }
    this.formInput = localStorage.getItem(this.sessionPrefix + this.sessionKey);
    this.navigateToActiveSession(sessionKey);
  }

  public newSession() {
    this.initializeSession(undefined);
  }

  private navigateToActiveSession(sessionKey: string): void {
    this.router.navigate([], { queryParams: { sessionKey } });
  }

  public storeSession(sessionInput: string | null): void {
    this.formInput = sessionInput ?? '';
    localStorage.setItem(
      this.sessionPrefix + this.sessionKey,
      this.formInput ?? ''
    );
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

  private storeSessionList() {
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

  public getSessionList() {
    let sessionKeyList = localStorage.getItem(this.sessionListKey);
    return sessionKeyList?.length ? JSON.parse(sessionKeyList) : [];
  }
}
