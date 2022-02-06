import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Recipe } from '../models/Recipe';
import { Observable } from 'rxjs';
import { PovratniObjektRecepata } from '../models/PovratniObjektRecepata';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

    httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
  constructor(private http:HttpClient) { }

  getPosts() : Observable<Recipe[]>{
    
    return this.http.get<Recipe[]>('http://localhost:3000/recepies');//.pipe(catchError(this.errorHandler));
      
    }

    getFilteredPosts(name:string, sastojak:string, pageNumber:string): Observable<PovratniObjektRecepata>{
      console.log(pageNumber);
      return this.http.get<PovratniObjektRecepata>(`http://localhost:3000/recepies?name=${name}&ingredient=${sastojak}&pagenumber=${pageNumber}`);
      
      }

      
  getOnePost(id:string): Observable<Recipe>{
  
  return this.http.get<Recipe>(`http://localhost:3000/recepieforupdate?id=${id}`);
  
  }

      postPost(recipe:Recipe): Observable<any>{
  
        return this.http.post('http://localhost:3000/recepies', recipe, this.httpOptions);
        
        }

        updatePost(id:string, post:Recipe): Observable<any>{
  
          return this.http.put(`http://localhost:3000/recepieforupdate?id=${id}`, post, this.httpOptions);
          
          }

          deletePost(id:string): Observable<any>{
  
            return this.http.delete<any>(`http://localhost:3000/deleterecepie?id=${id}`)
            
            }

}
