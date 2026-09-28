import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ProjectService } from '../../../core/services/project.service';

import { TransportationComponent } from './transportation.component';

describe('TransportationComponent', () => {
  let component: TransportationComponent;
  let fixture: ComponentFixture<TransportationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportationComponent],
      providers: [
        provideRouter([]),
        { provide: ProjectService, useValue: { getProjects: () => of({ data: [] }) } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
