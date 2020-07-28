import { positions, sections } from '../shared/my-types';

export class Section {
    constructor(
        public id: number,
        public sectionNumber: number,
        public sectionPosition: positions,
        public sectionType: sections,  
        public src?: string, 
        public description?: string, 
        public text?: string
      ){}
}
