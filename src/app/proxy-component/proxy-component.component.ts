import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ClickCatchDirectiveDirective } from '../click-catch-directive.directive';

@Component({
  selector: 'app-proxy-component',
  templateUrl: './proxy-component.component.html',
  styleUrls: ['./proxy-component.component.scss']
})
export class ProxyComponentComponent implements OnInit {
  proxyUrl: string = '';
  @ViewChild('iframeWrapper', { static: false }) iframeWrapper!: ElementRef;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    const url = this.route.snapshot.paramMap.get('url');
    this.proxyUrl = `${url}`;
  }


  fetchXpath(el: Element){
    const paths = [];

    for (; el && el.nodeType == Node.ELEMENT_NODE; el = el.parentNode as Element) {
      let index = 0;

      for (let sibling = el.previousSibling; sibling; sibling = sibling.previousSibling) {
        if (sibling.nodeType == Node.ELEMENT_NODE && sibling.nodeName == el.nodeName) {
          index++;
        }
      }

      const tagName = el.nodeName.toLowerCase();
      const pathIndex = index ? `[${index + 1}]` : '';
      paths.unshift(`${tagName}${pathIndex}`);
    }

    return paths.length ? `/${paths.join('/')}` : '';
  }
}
