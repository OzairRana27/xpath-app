import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScraperService {
  constructor(private http: HttpClient) { }

  scrape(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }
  updateAssetUrls(htmlContent: string, baseUrl: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const base = doc.createElement('base');
    base.href = baseUrl;
    doc.head.prepend(base);
    const elementsWithUrls = doc.querySelectorAll('[src], [href], [srcset], [data]');
    elementsWithUrls.forEach(element => {
      const attributeNames = ['src', 'href', 'data'];
      attributeNames.forEach(attributeName => {
        const attributeValue = element.getAttribute(attributeName);
        if (attributeValue && !attributeValue.startsWith('data:')) {
          element.setAttribute(attributeName, new URL(attributeValue, baseUrl).toString());
        }
      });
    });

    const elementsWithInlineStyles = doc.querySelectorAll('*[style]');
    elementsWithInlineStyles.forEach((element: any) => {
      if (element.style.position === 'absolute') {
        element.style.removeProperty('position');
      }
    });

    // remove external and embedded styles with position: absolute
    const styleSheets = doc.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
      const styleSheet = styleSheets[i] as CSSStyleSheet;
      const rules = styleSheet.cssRules;
      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j] as CSSStyleRule;
        if (rule.style.position === 'absolute') {
          styleSheet.deleteRule(j);
          j--;
        }
      }
    }

    return doc.documentElement.outerHTML;
  }
}
