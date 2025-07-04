import { ApplicationConfig, provideExperimentalZonelessChangeDetection, provideZoneChangeDetection } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, provideRouter, RouterModule, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import highlightJs from 'highlight.js';
import markdownit from 'markdown-it';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding())
  ],
};

export const md: markdownit = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  highlight: highlightCodeBlock,
});

export function highlightCodeBlock(str: string, lang: string) {
  if (lang && highlightJs.getLanguage(lang)) {
    try {
      return highlightJs.highlight(str, { language: lang }).value;
    } catch (__) {}
  }

  return '';
}
