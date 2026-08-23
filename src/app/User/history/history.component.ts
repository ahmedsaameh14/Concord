import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('reveal') revealElements!: QueryList<ElementRef<HTMLElement>>;

  readonly milestones = [
    {
      image: '/images/HistoryP1.jpeg',
      date: 'Between 1989 and 1994',
      subject: 'Foundation',
      description: 'the establishment phase took a variety of projects as a subcontractor for public sector entities, with the Arab Contractors Company at the forefront. These projects encompassed endeavours like Souq Al Ahad, Shubra Bajam, Al Zawiya Al Hamra, and conversions of utilities for the Greater Cairo Metro Tunnel Project.'
    },
    {
      image: '/images/HistoryP2.jpeg',
      date: 'From 1994 to 1999',
      subject: 'Principal contractor',
      description: 'Concord assumed the role of principal contractor for the Executive Authority for Wastewater, broadening its scope to include sanitation projects delegated by public sector entities across different governorates, notably in Upper Egypt. Noteworthy projects during this period included Project V24, Arab Ghanem, the Ahlanasya Pumping Station, El Fashn, and Samusta.'
    },
    {
      image: '/images/HistoryP3.jpeg',
      date: 'Between 1999 and 2004',
      subject: 'expansion',
      description: 'Concord expanded into government sector projects, under the leadership of the Greater Cairo Sewerage Company, initiating tunnelling activities for utility works. Notable endeavours during this period encompassed the West Nile Sewerage project, annual repairs of sewerage subsidence in Greater Cairo and Giza, the Al Matariyah project, the Imam Laithy Tunnels, and the Shubra Street Tunnels.'
    },
    {
      image: '/images/HistoryP4.jpeg',
      date: 'From 2004 to 2009',
      subject: 'Further expansion',
      description: 'further expansion occurred with the acquisition of new clients in the government sector, particularly with the New Urban Communities Authorities. Concord entered into electromechanical works and possessed a fleet of tunnelling equipment. Projects during this period included Integrated Sewerage in the Shawkar Area, remediation of deteriorated sewerage in the Mansuriyah Area, the establishment of water and sewerage networks in Kafr Hakim, Phase I water networks in New Cairo, development of facilities and roads networks in the October area, the establishment of water and sewerage networks and a pumping station in the Borg El Arab Industrial Zone, Mex Tunnels, Al Agami, Al Hanafiel, a sewage treatment plant in the Sixth of October City with a capacity of 50,000 cubic meters per day, and the tunnelling works for the Prince Amiriya Compound.'
    },
    {
      image: '/images/HistoryP5.jpg',
      date: 'Between 2009 and 2014',
      subject: 'Major tunnel projects',
      description: 'further expansion ensued with acquiring new clients in the government sector and diversifying into other areas such as roads and major tunnels. Projects during this period included utilities networks and roads in the Sixth of October Development Area, Baraka and Kafr Tahormos Tunnels, discharge lines and stations in New Cairo, sewage projects in Minya villages and the New Beni Suef area, Saharet Sarabeem under the Suez Canal, and car tunnels under the Suez Canal.'
    },
    {
      image: '/images/HistoryP6.jpeg',
      date: 'From 2014 to 2019',
      subject: 'New Administrative Capital',
      description: 'Concord expanded into roads and construction sectors and participated in constructing the New Administrative Capital. Projects during this period included Al Mahassemah Adyaat under the Suez Canal, duplication of the Martyr Ahmed Hamdi Tunnel under the Suez Canal, infrastructure facilities, roads, and development projects in the New Administrative Capital, the R3 Housing Project, the Administrative Control Authority building, Olympic City, Sports City in the New Administrative Capital, and the LRT high-speed train project.'
    },
    {
      image: '/images/HistoryP7.jpeg',
      date: 'Between 2019 and 2024',
      subject: 'Gulf area',
      description: 'Concord expanded its operations into the transportation and major national projects sectors, venturing into work outside Egypt with a branch in Saudi Arabia. Projects during this period included the Fourth Metro Line, bridges and stations for the high-speed train in Sokhna and October, workers’ facilities, the Latin Quarter construction in Alamein, water supply line for the New Administrative Capital, Complex Sewerage Line 3400 in the Capital, irrigation for the New Delta in Dabaa, Maspero Towers, Toshka, Future of Egypt, and Mostaqbal City.'
    }
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
    }, { threshold: 0.12 });

    this.revealElements.forEach(element => this.observer?.observe(element.nativeElement));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

}
