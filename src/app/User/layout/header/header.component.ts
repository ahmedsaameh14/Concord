import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  route?: string;
  children?: NavItem[];
  icon?: string;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isMenuOpen = false;
  activeRoute = '';
  isHomeRoute = true;
  private destroy$ = new Subject<void>();

  navigationItems: NavItem[] = [
    {
      label: 'About Us',
      children: [
        { label: 'Who We Are', route: '/about/who-we-are' },
        { label: 'Our Management Team', route: '/about/management' }
      ]
    },
    {
      label: 'Services',
      children: [
        { label: 'Infrastructure', route: '/services/infrastructure' },
        { label: 'Transportation', route: '/services/transportation' },
        { label: 'Construction', route: '/services/construction' }
      ]
    },
    {
      label: 'Projects',
      route: '/projects'
    },
    {
      label: 'News',
      children: [
        { label: 'Articles', route: '/news/articles' },
        { label: 'Awards', route: '/news/awards' }
      ]
    },
    {
      label: 'Careers',
      route: '/careers'
    },
    {
      label: 'Contact Us',
      route: '/contact'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateRouteState(this.router.url);
    window.scrollTo(0, 0);

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        this.updateRouteState(event.urlAfterRedirects);
        this.isMenuOpen = false;
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = !this.isHomeRoute || window.pageYOffset > 50;
  }

  private updateRouteState(url: string): void {
    this.activeRoute = url;
    this.isHomeRoute = url === '/' || url === '';
    this.isScrolled = !this.isHomeRoute || window.pageYOffset > 50;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  isActive(route?: string): boolean {
    if (!route) return false;
    return this.activeRoute.startsWith(route);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
