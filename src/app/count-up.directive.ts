import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true, 
})
export class CountUpDirective implements OnChanges {
  @Input() startVal: number = 0;
  @Input() endVal: number = 0; 
  @Input() duration: number = 2; 

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['endVal'] || changes['startVal'] || changes['duration']) {
      this.animateCount();
    }
  }

  private animateCount(): void {
    const startTime = performance.now();
    const durationMs = this.duration * 1000; 
    const start = this.startVal;
    const end = this.endVal;

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / durationMs, 1); 
      const currentVal = Math.floor(progress * (end - start) + start); 
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', currentVal);

      if (progress < 1) {
        requestAnimationFrame(step); 
      }
    };

    requestAnimationFrame(step); 
  }
}
