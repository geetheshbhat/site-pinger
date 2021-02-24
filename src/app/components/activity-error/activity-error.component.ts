import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Domains } from 'src/app/models/domainModel';
import { ErrorResponse } from 'src/app/models/errorResponse';
import { DataServiceService } from 'src/app/service/data-service.service';

@Component({
  selector: 'app-activity-error',
  templateUrl: './activity-error.component.html',
  styleUrls: ['./activity-error.component.scss']
})
export class ActivityErrorComponent implements OnInit {

  constructor(private _service: DataServiceService) { }
  lastError
  totalErrors
  domains =[]
  ngOnInit(): void {

    this._service.latestError().pipe(take(1)).subscribe(
      (res: ErrorResponse)=>{      
        if (!res.data.length){
        this.lastError= 0
        this.totalErrors = 0
        }  
        else{
          this.domains = res['data']
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
}
