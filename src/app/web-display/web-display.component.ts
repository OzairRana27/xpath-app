import { Component, OnInit, Sanitizer, ElementRef } from '@angular/core';
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

  fetchXPath(event: any){
    event.preventDefault()
    console.log(event)
    const element = event.target
    this.classes = element.classList
  }
}
