import {ValidatorFn, AbstractControl } from '@angular/forms';

export class MyValidators {

    static validateEmptyText(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: boolean} | null => {
            let valid = control.value && (control.value as string).trim();
            return valid ? null : {emptyText: true};
        };
    }
    static validateIframe(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: boolean} | null => {
            let src = (control.value as string)?.trim();
            let valid = control.value && src.trim() && src.startsWith("<iframe") && src.endsWith("</iframe>");
            return valid ? null : {invalidIframe: true};
        };
    }
    static validTextLength(text:string, maxlength:number):boolean{
        let valid = text && text.trim() && text.replace(/<.*?>|&nbsp;/g,"").length<=maxlength;
        return valid ? true : false;
    }

}