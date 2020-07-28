import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { EditPageComponent } from '../pages/edit-page/edit-page.component';
import { InputCitationTextComponent } from '../pages/edit-page/components/input-citation-text/input-citation-text.component';
import { InputTextComponent } from '../pages/edit-page/components/input-text/input-text.component';
import { InputPictureComponent } from '../pages/edit-page/components/input-picture/input-picture.component';
import { InputSliderComponent } from '../pages/edit-page/components/input-slider/input-slider.component';
import { InputVideoComponent } from '../pages/edit-page/components/input-video/input-video.component';
import { InputSectionTypeComponent } from '../pages/edit-page/components/input-section-type/input-section-type.component';
import { InputHeadPictureComponent } from '../pages/edit-page/components/input-head-picture/input-head-picture.component';


const routes: Routes = [
    {
        path: '',  component: EditPageComponent
    }
]

@NgModule({
    declarations: [ 
        EditPageComponent,
        InputCitationTextComponent,
        InputTextComponent,
        InputPictureComponent,
        InputSliderComponent,
        InputVideoComponent,
        InputSectionTypeComponent,
        InputHeadPictureComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers:[],
    exports: [RouterModule]
  })
export class EditRoutingModule { }