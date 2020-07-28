import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPageComponent } from '../pages/admin-page/admin-page.component';
import { LogonComponent } from '../pages/admin-page/children/logon/logon.component';
import { EditUserComponent } from '../pages/admin-page/children/edit-user/edit-user.component';
import { AuthGuard } from '../guards/auth.guard';
import { NewsCategoriesComponent } from '../pages/admin-page/children/news-categories/news-categories.component';
import { UsersCommentsComponent } from '../pages/admin-page/children/users-comments/users-comments.component';
import { SharedModule } from '../shared/shared.module';


const routes: Routes = [
    {
        path: '',  component: AdminPageComponent, children:[
            { path: 'logon', component: LogonComponent},
            { path: '', redirectTo:'logon', pathMatch: 'full'},
            { path: 'edit', component: EditUserComponent, canActivate: [AuthGuard]},
            { path: 'categories', component: NewsCategoriesComponent, canActivate: [AuthGuard]} ,
            { path: 'comments', component: UsersCommentsComponent, canActivate: [AuthGuard]} ,
        ]
    }
]

@NgModule({
    declarations: [ 
        AdminPageComponent,
        LogonComponent,
        EditUserComponent,
        LogonComponent,
        NewsCategoriesComponent, 
        UsersCommentsComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers:[AuthGuard],
    exports: [RouterModule]
  })
export class AdminRoutingModule { }
