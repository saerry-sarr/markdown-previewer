import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import highlightJs from 'highlight.js';
import markdownit from 'markdown-it';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
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
