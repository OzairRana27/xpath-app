import {
  Directive,
  ElementRef,
  OnInit,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[appIframeTracker]'
})
export class ClickCatchDirectiveDirective implements OnInit {
  private iframeMouseOver: boolean = false;

  @Input() debug: boolean = true;

  @Output() iframeClick = new EventEmitter<string>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.listen(window, 'blur', () => this.onWindowBlur());
  }

  @HostListener('mouseover')
  private onIframeMouseOver() {
    this.log('Iframe mouse over');
    this.iframeMouseOver = true;
    this.resetFocusOnWindow();
  }

  @HostListener('mouseout')
  private onIframeMouseOut() {
    this.log('Iframe mouse out');
    this.iframeMouseOver = false;
    this.resetFocusOnWindow();
  }

  private onWindowBlur() {
    console.log('here')
    if (this.iframeMouseOver) {
      const xpath = this.getXPath(this.el.nativeElement);
      this.log(`WOW! Iframe click!!! XPath: ${xpath}`);
      this.resetFocusOnWindow();
      this.iframeClick.emit(xpath);
    }
  }

  private resetFocusOnWindow() {
    setTimeout(() => {
      this.log('reset focus to window');
      window.focus();
    }, 100);
  }

  private log(message: string) {
    if (this.debug) {
      console.log(message);
    }
  }

  private getXPath(element: HTMLElement): string {
    const path = [];
    let currentElement: any = element;
    while (currentElement) {
      if (currentElement.tagName === 'BODY') {
        path.unshift(currentElement.tagName);
        break;
      }
      const index = this.getChildIndex(currentElement);
      const tagName = currentElement.tagName.toLowerCase();
      path.unshift(`${tagName}[${index}]`);
      currentElement = currentElement.parentElement;
    }
    return `//${path.join('/')}`;
  }

  private getChildIndex(element: HTMLElement): number {
    let index = 1;
    let previousSibling = element.previousElementSibling;
    while (previousSibling) {
      index++;
      previousSibling = previousSibling.previousElementSibling;
    }
    return index;
  }
}
