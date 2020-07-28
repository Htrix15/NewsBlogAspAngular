import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartPageComponent } from '../pages/start-page/start-page.component';
import { CategoryPageComponent } from '../pages/category-page/category-page.component';
import { NewsPageComponent } from '../pages/news-page/news-page.component';
import { ArticleResolver } from '../resolvers/article.resolver';
import { ErrorPageComponent } from '../pages/error-page/error-page.component';
import { StartPageResolver } from '../resolvers/start-page.resolver';
import { CitationTextComponent } from '../pages/news-page/components/citation-text/citation-text.component';
import { TextComponent } from '../pages/news-page/components/text/text.component';
import { PictureComponent } from '../pages/news-page/components/picture/picture.component';
import { SliderComponent } from '../pages/news-page/components/slider/slider.component';
import { VideoComponent } from '../pages/news-page/components/video/video.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
    {
        path: '',  runGuardsAndResolvers: "paramsOrQueryParamsChange",  children:[
            {
                path: '', component: StartPageComponent
            },
            {
                path: 'category/:id', component: CategoryPageComponent
            },
            {
                path: 'news/:id', children:[
                    { path: '' , component: NewsPageComponent },
                    { path: 'edit', loadChildren: () => import('./edit-routing.module').then(mod => mod.EditRoutingModule) },
                    { path: '**', redirectTo: 'error'}
                ], resolve : {data: ArticleResolver}
            },
            {
                path: 'admin', loadChildren: () => import('./admin-routing.module').then(mod => mod.AdminRoutingModule),            
            },
            {
                path: 'error', component: ErrorPageComponent
            },
            {
                path: '**', redirectTo: 'error'
            }
        ], resolve : {data: StartPageResolver}
    }
]
@NgModule({
    declarations: [ 
        StartPageComponent,
        CategoryPageComponent,
        NewsPageComponent,
        ErrorPageComponent,
        CitationTextComponent,
        TextComponent,
        PictureComponent,
        SliderComponent,
        VideoComponent,
    ],
    imports: [SharedModule,RouterModule.forRoot(routes)],
    providers:[StartPageResolver, ArticleResolver],
    exports: [RouterModule]
  })
export class AppRoutingModule { }
