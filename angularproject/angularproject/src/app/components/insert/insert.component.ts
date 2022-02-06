import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/models/Recipe';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.css']
})
export class InsertComponent implements OnInit {

  recipe:Recipe = <Recipe>{};
  sastojci:string = "";
  insertorupdate:string="insert";
  constructor(private httpClient:HttpServiceService, private router:Router,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => { 
      //console.log(params['id'])
      if(params['id'] != undefined){
        
        this.insertorupdate = "update";

        this.httpClient.getOnePost(params['id']).subscribe(x => this.recipe = x);

      } 
    })
  }

  onSubmit(){

    if(this.insertorupdate == "insert"){
      this.httpClient.postPost(this.recipe).subscribe(x => this.router.navigate(['/listarecepata']))
    }
    else{
      this.httpClient.updatePost(this.recipe._id, this.recipe).subscribe(x => this.router.navigate(['/listarecepata']))
    }
  }

}
