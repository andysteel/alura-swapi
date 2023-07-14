import { TestBed } from '@angular/core/testing';
import { DefaultColorDirective } from './default-color.directive';
import { ElementRef } from '@angular/core';

describe('DefaultColorDirective', () => {

  const element = TestBed.inject(ElementRef)
  it('should create an instance', () => {
    const directive = new DefaultColorDirective(element);
    expect(directive).toBeTruthy();
  });
});
