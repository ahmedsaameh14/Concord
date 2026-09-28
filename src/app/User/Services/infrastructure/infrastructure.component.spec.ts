import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ProjectService } from '../../../core/services/project.service';

import { InfrastructureComponent } from './infrastructure.component';

describe('InfrastructureComponent', () => {
  let component: InfrastructureComponent;
  let fixture: ComponentFixture<InfrastructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfrastructureComponent],
      providers: [
        provideRouter([]),
        { provide: ProjectService, useValue: { getProjects: () => of({ data: [] }) } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfrastructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
