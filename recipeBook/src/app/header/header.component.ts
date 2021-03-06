import { Component, } from '@angular/core';
import { DataStorageService } from '../Shared/data-storage.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'

})
 export class HeaderComponent{

    constructor(private dSService: DataStorageService){

    }

    onSaveData(){
        this.dSService.storeRecipes();
    }

    onFetchData(){
        this.dSService.fetchRecipes();
    }

 }