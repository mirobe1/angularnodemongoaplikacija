import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule }    from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { ListaRecepataComponent } from './components/lista-recepata/lista-recepata.component';
import { InsertComponent } from './components/insert/insert.component';
import { UpdateComponent } from './components/update/update.component';


const appRoutes: Routes = [	
  //{path:'', redirectTo:'/listarecepata', pathMatch: 'full'},
  {path:'listarecepata', component:ListaRecepataComponent },
  {path:'dodaj', component:InsertComponent },
  {path:'dodaj/:id', component:InsertComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    ListaRecepataComponent,
    InsertComponent,
    UpdateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
