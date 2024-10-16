import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionKey = '';
  private sessionPrefix = 'session-';
  public sessionData = new BehaviorSubject('');

  constructor(private readonly route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params: Params) => {
      const sessionKey = params['sessionKey'];
      if (sessionKey) {
        this.sessionKey = sessionKey;
        this.initializeSession(sessionKey);
      }
    });
  }

  private initializeSession(sessionKey: string): void {
    console.log(sessionKey);
    if (sessionKey) {
      this.restoreSession(sessionKey);
      return;
    }
    this.sessionKey = this.getSessionKey();
    console.log('sessionkey', this.sessionKey, sessionKey);
    this.saveSession('');
  }

  private getSessionKey(): string {
    const sessionKey = this.generateRandomString(15);
    return sessionKey;
  }

  public restoreSession(sessionKey: string): void {
    let sessionData: string | null = null;
    if (sessionKey) {
      sessionData = localStorage.getItem(this.sessionPrefix + this.sessionKey);
      this.navigateToActiveSession(sessionKey);
    }
    this.sessionData.next(sessionData ? sessionData : '');
  }

  private navigateToActiveSession(sessionKey: string): void {
    this.router.navigate([], { queryParams: { sessionKey } });
  }

  public saveSession(sessionEntries: string): void {
    localStorage.setItem('session-' + this.sessionKey, sessionEntries);
    this.sessionData.next(sessionEntries);
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
}
