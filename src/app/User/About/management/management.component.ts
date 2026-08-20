import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-management',
  imports: [CommonModule],
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('reveal') revealElements!: QueryList<ElementRef<HTMLElement>>;

  isChairmanModalOpen = false;

  readonly boardMembers = [
    { name: 'Eng. Ahmed Soliman', position: 'Shareholder & Board Member' },
    { name: 'Eng. Gamal Mesharafa', position: 'Shareholder & Board Member' },
    { name: 'Eng. Tamer Ibrahem', position: 'Shareholder & Board Member' }
  ];

  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.revealElements.forEach(element => element.nativeElement.classList.add('is-visible'));
      return;
    }

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        this.observer?.unobserve(entry.target);
      });
    }, { threshold: 0.14 });

    this.revealElements.forEach(element => this.observer?.observe(element.nativeElement));
  }

  openChairmanModal(): void {
    this.isChairmanModalOpen = true;
    document.body.classList.add('modal-open');
  }

  closeChairmanModal(): void {
    this.isChairmanModalOpen = false;
    document.body.classList.remove('modal-open');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isChairmanModalOpen) this.closeChairmanModal();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    document.body.classList.remove('modal-open');
  }

}
