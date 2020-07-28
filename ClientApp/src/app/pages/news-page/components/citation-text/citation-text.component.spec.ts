/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CitationTextComponent } from './citation-text.component';

describe('CitationTextComponent', () => {
  let component: CitationTextComponent;
  let fixture: ComponentFixture<CitationTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitationTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitationTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
