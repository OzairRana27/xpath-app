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
    return doc.documentElement.outerHTML;
  }
}
