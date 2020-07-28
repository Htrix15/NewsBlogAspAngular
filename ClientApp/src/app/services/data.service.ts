import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class DataService {

  private url:string;

  constructor(private http: HttpClient) { 
    this.url = "/api";
  }

  getAuth(url:string, token:string){
    return this.http.get(`${url}${token}`);
  }


  getJSONP(url:string){
    return this.http.jsonp(url, null); 
  }

  getUserDatas<T>(typeDatas: string, queryParams?: Map<string, string>) {
    let myParams = new HttpParams();
    if(queryParams){
      queryParams.forEach((value, key)=>{
        myParams = myParams.append(key, value)
      });
    }
    return this.http.get<T>(this.url + '/' + typeDatas, { params: myParams });
  }

  putUserDatas<T, J>(putItem: T, typeItem: string) {
    return this.http.put<J>(this.url+'/'+typeItem, putItem);
  }
  
  postUserDatas<T, J>(postItem: T, typeItem: string) {
    return this.http.post<J>(this.url+'/'+typeItem, postItem);
  }

  delUserDatas(delItem: string, queryParams?: Map<string, string>) {
    let myParams = new HttpParams();
    if(queryParams){
      queryParams.forEach((value, key)=>{
        myParams = myParams.append(key, value)
      });
    }
    return this.http.delete(this.url+'/'+delItem, {params: myParams }); 
  }

  postMultipartDatas<T>(postItem: FormData, typeDatas: string, queryParams?: Map<string, string>) {
    let myParams = new HttpParams();
    if(queryParams){
      queryParams.forEach((value, key)=>{
        myParams = myParams.append(key, value)
      });
    }
    return this.http.post<T>(this.url+'/'+ typeDatas, postItem, {params: myParams });
  }

  putMultipartDatas<T>(putItem: FormData, typeDatas: string, queryParams?: Map<string, string>) {
    let myParams = new HttpParams();
    if(queryParams){
      queryParams.forEach((value, key)=>{
        myParams = myParams.append(key, value)
      });
    }
    return this.http.put<T>(this.url+ '/'+ typeDatas, putItem,{params: myParams });
  }

}
