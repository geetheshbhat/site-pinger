import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Domains } from 'src/app/models/domainModel';
import { ErrorResponse } from 'src/app/models/errorResponse';
import {DataServiceService} from './../../service/data-service.service'

@Component({
  selector: 'app-status-board',
  templateUrl: './status-board.component.html',
  styleUrls: ['./status-board.component.scss']
})
export class StatusBoardComponent implements OnInit {

  constructor(private _service : DataServiceService, private _router: Router) { 
    if (!localStorage.getItem('itemKey')){
      this._router.navigate(['/'])
    }
  }
  domains: Domains[]
  apiDomains: Domains[]
  downDomains=[]
  lastError
  totalErrors
  systemDown: boolean
  ngOnInit(): void {
    this._service.getData().pipe(take(1)).subscribe(
      (res :  Domains)=>{
        this.domains=res['allDomains'].filter( item => item.domainType == 'static' || item.domainType == 'journey')
        this.apiDomains = res['allDomains'].filter( item => item.domainType == 'api')

        this.domains.find(domain=>{
          if (domain.domainStatus=='down'){
            this.downDomains.push(domain)
          }
        })
        if (this.downDomains.length!=0){
          
          this.systemDown=true
        }
        else this.systemDown=false
        
      }
    )
    this._service.latestError().pipe(take(1)).subscribe(
      (res)=>{      
        if (!res.data.length){
        this.lastError= 0
        this.totalErrors = 0
        }  
        else{
          this.lastError= res.data[0].createdAt.split('T')[0]
        let currDate= new Date().getDate()
        let lastErrorDate= new Date(this.lastError).getDate()
        let temp = currDate - lastErrorDate
        this.lastError= temp
        this.totalErrors = res.data.length
        } 
      }
    )
  }

  refresh(){
    this._service.refreshSite().subscribe(
      (res)=>{
        this._router.navigate(['/dashboard'])
      }
    )
  }

  logOut(){
    localStorage.removeItem('itemKey')
    this._router.navigate(['/'])
  }
  
}

