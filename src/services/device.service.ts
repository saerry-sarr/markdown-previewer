import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class DeviceService {
	private platformBrowser: boolean;

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {
		this.platformBrowser = isPlatformBrowser(this.platformId);
	}

	public isPlatformBrowser(): boolean {
		return this.platformBrowser;
	}

  public isTouchDevice(): boolean {
    return navigator.maxTouchPoints !== 0;
  }

  public isMacintosh() {
    console.log('userAgent', navigator.userAgent);
  return navigator.userAgent.indexOf('Mac') > -1
}

public isWindows() {
  return navigator.userAgent.indexOf('Win') > -1
}
}
