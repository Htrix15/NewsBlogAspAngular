import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ArticleCategory } from 'src/app/models/article-category';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MyValidators } from 'src/app/shared/MyValidators';

@Component({
  selector: 'app-news-categories',
  templateUrl: './news-categories.component.html',
  styleUrls: ['./news-categories.component.scss']
})
export class NewsCategoriesComponent implements OnInit {

  public categories:Array<ArticleCategory>;

  public categoriesForms:FormArray;
  public swapCategoriesForms:FormGroup;

  public idDelCategories:number;
  public idNewCategories:number;
  private idxDelCategories:number;

  private getCategorySubscribe: Subscription; 
  private delCategorySubscribe: Subscription; 
  private putCategorySubscribe: Subscription; 
  private postCategorySubscribe: Subscription; 

  constructor(private dataService: DataService) { 
    this.categories = new Array<ArticleCategory>();
    this.categoriesForms = new FormArray([]);
    this.idDelCategories = -1;
    this.idNewCategories = -1;
    this.idxDelCategories = -1;
  }

  ngOnInit() {
    this.swapCategoriesForms = new FormGroup({
      idSwapCategory: new FormControl(this.categories)
    });

    this.getCategorySubscribe = this.dataService.getUserDatas<Array<ArticleCategory>>("article-categories").subscribe(
      categories =>{
        this.categories = categories;
        for(let category of this.categories){
          this.categoriesForms.push(
            new FormGroup(
              {
                id: new FormControl(category.id),
                desc: new FormControl(category.desc, [Validators.maxLength(20), MyValidators.validateEmptyText()])
              }
            )
          );
        }
      },
      error => console.log(error)
    );
  }

  updateCategory(form: FormGroup, iForm:number){
    this.putCategorySubscribe = this.dataService.putUserDatas<ArticleCategory, null>(new ArticleCategory(form.controls["id"].value, form.controls["desc"].value),"article-category").subscribe(
      ()=>{this.categories[iForm].desc = form.controls["desc"].value;}
    );
  }

  delCategoryStep1(form: FormGroup, idxDel: number){
    this.idDelCategories = form.value.id;
    this.idxDelCategories = idxDel;
  }
  
  delCategoryStep2(){
    this.idNewCategories = this.swapCategoriesForms.value?.idSwapCategory?.id;
    if(this.idNewCategories){
      let swapCategory = new Map<string, string>();
      swapCategory.set("del", this.idDelCategories.toString());
      swapCategory.set("upd",  this.idNewCategories.toString())
      this.delCategorySubscribe = this.dataService.delUserDatas("article-category", swapCategory).subscribe(
        () => {
          this.categories.splice(this.idxDelCategories, 1);
          this.categoriesForms.controls.splice(this.idxDelCategories, 1);
          this.idDelCategories=-1;
          this.idxDelCategories = -1;
        },
        () => { this.idDelCategories=-1; this.idxDelCategories = -1;}
      );
    }
  }

  addCategory(){
    this.postCategorySubscribe = this.dataService.postUserDatas<string, ArticleCategory>(null, "article-category")
      .subscribe(newArticleCategory => {
        this.categories.push(newArticleCategory);
        this.categoriesForms.push(
          new FormGroup(
            {
              id: new FormControl(newArticleCategory.id),
              desc: new FormControl(newArticleCategory.desc, [Validators.maxLength(20), MyValidators.validateEmptyText()])
            }
          )
        );
      });
  }

  ngOnDestroy(){
    if(this.delCategorySubscribe){this.delCategorySubscribe.unsubscribe();}
    if(this.getCategorySubscribe){this.getCategorySubscribe.unsubscribe();}
    if(this.postCategorySubscribe){this.postCategorySubscribe.unsubscribe();}
    if(this.putCategorySubscribe){this.putCategorySubscribe.unsubscribe();}
  }

}
