import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-proxy-component',
  templateUrl: './proxy-component.component.html',
  styleUrls: ['./proxy-component.component.scss']
})
export class ProxyComponentComponent implements OnInit,AfterViewInit {
  proxyUrl: string = '';
  @ViewChild('iframeWrapper', { static: false }) iframeWrapper!: ElementRef;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    const url = this.route.snapshot.paramMap.get('url');
    this.proxyUrl = `${url}`;
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.addClickEventListener();
    }, 2000)
  }

  addClickEventListener() {
    console.log(this.iframeWrapper)
    const iframeEl = this.iframeWrapper.nativeElement;
    iframeEl.addEventListener('click', (event: MouseEvent) => {
      console.log('click performed')
      event.stopPropagation();
      event.preventDefault();
      const xpath = this.fetchXpath(event.target as Element);
      console.log(xpath);
    });
    // const iframeWrapper = this.iframeWrapper.nativeElement;
    // console.log('iframeWrapper:', iframeWrapper);
    // const iframe = iframeWrapper.querySelector('iframe');
    // console.log('iframe:', iframe);
    // iframe.addEventListener('load', () => {
    //   const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    //   document.addEventListener('click', event => {
    //     event.preventDefault();
    //     if (event.target instanceof HTMLElement && iframe.contains(event.target)) {
    //       const clickedEl = iframeDoc.elementFromPoint(event.clientX, event.clientY);
    //       console.log(this.fetchXpath(clickedEl));
    //     }
    //   });
    // });
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
