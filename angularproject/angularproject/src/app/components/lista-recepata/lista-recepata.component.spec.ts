import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRecepataComponent } from './lista-recepata.component';

describe('ListaRecepataComponent', () => {
  let component: ListaRecepataComponent;
  let fixture: ComponentFixture<ListaRecepataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaRecepataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaRecepataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
