import { OdooResponse } from "./odoo-response";
import { OdooUser } from './odoo-user';
export class AuthenticateCallback {
    isSuccess: boolean = false;
    _response: OdooResponse;
    _newSessionId: string;
  
    constructor(
        isSuccess: boolean, response: OdooResponse, newSessionId: string) {
      this.isSuccess = isSuccess;
      this._response = response;
      this._newSessionId = newSessionId;
    }
  
    getSessionId(): string  {
      return this._newSessionId;
    }
  
    getUser(): OdooUser {
        const odooUser = new OdooUser();
        const odooUserParsed =  odooUser.parse(this._response, this._newSessionId);
      return odooUserParsed;
    }
  
    getError() {
      return !this.isSuccess ? this._response.getError() : null;
    }
  
  
  }