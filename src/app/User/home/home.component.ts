import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('reveal') revealElements!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('strengthsSection') strengthsSection!: ElementRef<HTMLElement>;

  readonly heroVideo = '/video/hero-vid.mp4';
  readonly sustainabilityColumns = [
    {
      title: 'Corporate Responsibility is Good Business',
      text: 'Concord Engineering & Contracting Company stands as one of only five Egyptian construction firms participating in the United Nations Global Compact, aligning its operations with the 17 Sustainable Development Goals (SDGs). This global compliance is not just a badge of honor—it’s a strategic pillar that integrates economic performance with positive environmental and social impact. Concord’s commitment to human rights, anti-corruption, and public transparency (UNGC Principles 1, 2, and 10) proves that ethical practices and sustainable development are integral to long-term business success.'
    },
    {
      title: 'A Legacy of Building Better Lives',
      text: 'At Concord, “Building for the best” means more than erecting structures—it means uplifting communities. With a legacy rooted in community giving, Concord channels its efforts into enhancing lives, ensuring safety, and increasing accessibility through its projects. The company believes every decision shapes the lives of people and future generations. From creating safe environments to advancing sustainable construction practices, Concord continues to prioritize humanity, well-being, and shared progress in everything it builds.'
    },
    {
      title: 'Shaping The Future Through Sustainable Innovation',
      text: 'With more than 40 years of expertise and a global team of over 30,000 professionals, Concord combines knowledge and foresight to shape modern living. The company is driven by its purpose: to never be bystanders in the face of global challenges like climate change and inequality. Through collaboration, innovation, and responsible construction, Concord actively pursues sustainable solutions—turning vision into reality for a healthier, more connected, and more inclusive world.'
    }
  ];

  readonly strengths = [
    { target: 600, current: 0, suffix: '+', description: 'Completed projects, showcasing technical excellence.' },
    { target: 15000, current: 0, suffix: '+', description: 'Skilled professionals, trained to adapt to diverse conditions.' },
    { target: 40, current: 0, suffix: '+', description: 'Years of industry experience, driving innovation and community development.' }
  ];

  readonly companies = [
    { source: '/images/C1.png', alt: 'Concord company one' },
    { source: '/images/C2.png', alt: 'Concord company two' },
    { source: '/images/C3.png', alt: 'Concord company three' },
    { source: '/images/C4.png', alt: 'Concord company four' },
    { source: '/images/C5.png', alt: 'Concord company five' }
  ];

  private observer?: IntersectionObserver;
  private countersStarted = false;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.revealElements.forEach(element => element.nativeElement.classList.add('is-visible'));
      this.startCounters();
      return;
    }

    this.observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        if (entry.target === this.strengthsSection.nativeElement) {
          this.startCounters();
          this.observer?.unobserve(entry.target);
        } else {
          entry.target.classList.add('is-visible');
          this.observer?.unobserve(entry.target);
        }
      }),
      { threshold: 0.16 }
    );

    this.revealElements.forEach(element => this.observer?.observe(element.nativeElement));
    this.observer.observe(this.strengthsSection.nativeElement);
  }

  startCounters(): void {
    if (this.countersStarted) return;
    this.countersStarted = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.strengths.forEach(stat => stat.current = stat.target);
      return;
    }

    const startTime = performance.now();
    const duration = 1600;
    const animate = (time: number): void => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      this.strengths.forEach(stat => stat.current = Math.round(stat.target * easedProgress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

}
