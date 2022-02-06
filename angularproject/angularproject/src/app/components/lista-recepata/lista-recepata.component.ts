import { Component, OnInit } from '@angular/core';
import { Pager } from 'src/app/models/Pager';
import { Recepti } from 'src/app/models/Recepti';
import { Recipe } from 'src/app/models/Recipe';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-lista-recepata',
  templateUrl: './lista-recepata.component.html',
  styleUrls: ['./lista-recepata.component.css']
})
export class ListaRecepataComponent implements OnInit {

  recepies:Recipe[] = [];
  namea:string="";
  sastojak:string="";
  pager:Pager = <Pager>{};
  isNotFirstPage:boolean = false;
  isNotLastPage:boolean = true;
  hasData:boolean = true;
  constructor(private httpClient:HttpServiceService) { }

  PretvoriUListuRecepataSaSatojcima(nizRecepata:Recepti[]){
    var recepti:Recipe[] = [];
    nizRecepata.forEach(element => {
      var recept:Recipe = <Recipe>{};
      recept._id = element._id;
      recept.name = element.name;
      recept.description = element.description;
      //recept.sastojci = element.ingredienti.join(',');
      var sastojci = "";   
      element.ingredienti.forEach(elem => {
        sastojci = sastojci + elem.name;
        sastojci = sastojci + ',';
      });
      recept.sastojci = sastojci.slice(0, -1);
      recepti.push(recept);
    });

    return recepti;
  }

  OdradiPagination(currentPage:number,numberOfPages:number){
    if(numberOfPages == 0){
      this.isNotFirstPage = false;
        this.isNotLastPage = false;
        this.hasData = false;
    }else{
      this.hasData = true;
      if(numberOfPages == 1){
        this.isNotFirstPage = false;
        this.isNotLastPage = false;
      }else if(numberOfPages == currentPage){
        this.isNotFirstPage = true;
        this.isNotLastPage = false;
      }else if(numberOfPages > 1  && currentPage == 1){
        this.isNotFirstPage = false;
        this.isNotLastPage = true;
      }else{
        this.isNotFirstPage = true;
        this.isNotLastPage = true;
      }
    }
    
  }
  ngOnInit(){
    this.httpClient.getFilteredPosts("","","1").subscribe(x => {
                  this.recepies = this.PretvoriUListuRecepataSaSatojcima(x.recepies);

                  this.pager.currentPage = x.currentPage;
                  this.pager.nextPage = x.currentPage + 1;
                  this.pager.numberOfPages = x.numberOfPages;

                  this.OdradiPagination(x.currentPage, x.numberOfPages);
                  // if(x.numberOfPages == 1){
                  //   this.isNotFirstPage = false;
                  //   this.isNotLastPage = false;
                  // }else if(x.numberOfPages == x.currentPage){
                  //   this.isNotFirstPage = true;
                  //   this.isNotLastPage = false;
                  // }else if(x.numberOfPages > 1  && x.currentPage == 1){
                  //   this.isNotFirstPage = false;
                  //   this.isNotLastPage = true;
                  // }else{
                  //   this.isNotFirstPage = true;
                  //   this.isNotLastPage = true;
                  // }

                });
  }

  Izbrisi(id:string){
    this.httpClient.deletePost(id).subscribe(x => this.Filter());
  }

  Filter(){
    this.httpClient.getFilteredPosts(this.namea, this.sastojak, "1").subscribe(x => {
      this.recepies = this.PretvoriUListuRecepataSaSatojcima(x.recepies);
 
      this.pager.currentPage = x.currentPage;
      this.pager.nextPage = x.currentPage + 1;
      this.pager.numberOfPages = x.numberOfPages;

      this.OdradiPagination(x.currentPage, x.numberOfPages);

      // if(x.numberOfPages == 1){
      //   this.isNotFirstPage = false;
      //   this.isNotLastPage = false;
      // }else if(x.numberOfPages == x.currentPage){
      //   this.isNotFirstPage = true;
      //   this.isNotLastPage = false;
      // }else if(x.numberOfPages > 1  && x.currentPage == 1){
      //   this.isNotFirstPage = false;
      //   this.isNotLastPage = true;
      // }else{
      //   this.isNotFirstPage = true;
      //   this.isNotLastPage = true;
      // }

      console.log(x);
    });
    console.log(this.recepies);
  }

  Pageaj(stacemo:string){
    var page = "1";


    //console.log(stacemo);
     if(stacemo == 'First'){
      this.httpClient.getFilteredPosts(this.namea, this.sastojak, "1").subscribe(x => {
        this.recepies = this.PretvoriUListuRecepataSaSatojcima(x.recepies);
  
        this.pager.currentPage = x.currentPage;
        this.pager.nextPage = x.currentPage + 1;
        this.pager.numberOfPages = x.numberOfPages;
  
        this.OdradiPagination(x.currentPage, x.numberOfPages);
  
      });
    }else{


     if(stacemo == 'Prev'){
      page = (this.pager.currentPage - 1).toString();
    }else if(stacemo == 'Next'){
      page = (this.pager.currentPage + 1).toString();
    }else if('Last'){
      page = this.pager.numberOfPages.toString();
    }

    this.httpClient.getFilteredPosts(this.namea, this.sastojak, page).subscribe(x => {
      this.recepies = this.PretvoriUListuRecepataSaSatojcima(x.recepies);

      this.pager.currentPage = x.currentPage;
      this.pager.nextPage = x.currentPage + 1;
      this.pager.numberOfPages = x.numberOfPages;

      this.OdradiPagination(x.currentPage, x.numberOfPages);

    });

  }
}

}
