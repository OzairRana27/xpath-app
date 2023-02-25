import { Component, OnInit, ElementRef } from '@angular/core';
import { ScraperService } from '../web-scraping.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-web-display',
  templateUrl: './web-display.component.html',
  styleUrls: ['./web-display.component.scss']
})
export class WebDisplayComponent implements OnInit {
  html: any = ''
  sanitizedHtmlContent: any = ''
  classes: any = ''
  xpath: any = ''
  constructor(private scraperService: ScraperService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private elementRef: ElementRef) {}

  ngOnInit(): void {
    const url: any = this.route.snapshot.paramMap.get('url');
    this.scraperService.scrape(url).subscribe((html:any) => {
      this.html = html;
      const cssRegex = /<style.*?>(.*?)<\/style>/gs;
      const styleSheets = this.html.match(cssRegex);
      const head = this.elementRef.nativeElement.ownerDocument.head;
      const style = this.elementRef.nativeElement.ownerDocument.createElement('style');
      style.type = 'text/css';
      style.innerHTML = styleSheets;
      head.appendChild(style);
      this.sanitizedHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.scraperService.updateAssetUrls(this.html, url));
    });
  }

  processInformation(event: any){
    event.preventDefault()
    var element = event.target
    this.classes = element.classList
    element = document.elementFromPoint(event.clientX, event.clientY);
    this.xpath = this.getXPath(element)
  }

  getXPath = (element: any): any => {
    if (element && element.nodeType === Node.ELEMENT_NODE) {
        const idx = [...element.parentNode.children].indexOf(element) + 1;
        if (element.classList.contains('display-div')) {
            return '';
        } else {
          if(element.className.length)
            return this.getXPath(element.parentNode) + `/ <${element.tagName.toLowerCase()} class='${element.className}'> [${idx}] `;
          else{
            return this.getXPath(element.parentNode) + `/ <${element.tagName.toLowerCase()}> [${idx}] `;
          }
        }
    } else {
        return '';
    }
  };
}
