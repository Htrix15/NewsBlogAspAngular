import { sections } from '../shared/my-types';
import { ISectionData } from '../shared/i-section-data';
import { SectionSort } from './section-sort';

export class ArticleSection {
    constructor(
        public centerSectionType?: sections,
        public leftSectionType?: sections,
        public rightSectionType?: sections,
        public inputSectionId?: number,
        public centerSectionData?: ISectionData,
        public leftSectionData?: ISectionData,
        public rightSectionData?: ISectionData
      ){}

    public getSectionIdAndNewNumber(newSectonNumber:number):Array<SectionSort>
    {
      let result = new Array<SectionSort>();
      if(this.centerSectionData) {result.push(new SectionSort(this.centerSectionData.id, newSectonNumber));}
      if(this.leftSectionData) {result.push(new SectionSort(this.leftSectionData.id, newSectonNumber));}
      if(this.rightSectionData) {result.push(new SectionSort(this.rightSectionData.id, newSectonNumber));}

      return result;
    }

    public getInputSectionIdAndNewNumber(newSectonNumber:number):Array<SectionSort>
    {
      let result = new Array<SectionSort>();
      result.push(new SectionSort(this.inputSectionId, newSectonNumber));
      return result;
    }
    
    public checkEmpty():boolean{
      return (!this.centerSectionData && !this.leftSectionData && !this.rightSectionData);
    }
}
