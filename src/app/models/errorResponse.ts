export interface ErrorResponse{
    data: [{
    id : number,
    domainId: number,
    errorMessage: string,
    errorStatus: string,
    domainName: string,
    emailTriggered: boolean,
    createdAt: string,
    updatesAt: string
    }]
  }