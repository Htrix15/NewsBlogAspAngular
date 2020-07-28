import { NgModule } from "@angular/core";
import { CommentsComponent } from "./components/comments/comments.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CheckSckrollPositionDirective } from "./check-sckroll-position.directive";
import { CommonModule } from "@angular/common";
import { LazyLoadImageModule} from 'ng-lazyload-image';

@NgModule({
    declarations: [ 
        CommentsComponent,
        CheckSckrollPositionDirective,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LazyLoadImageModule
    ],
    providers:[

       ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CommentsComponent,
        CheckSckrollPositionDirective,
        LazyLoadImageModule
    ]
  })
export class SharedModule { }