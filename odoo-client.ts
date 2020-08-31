import { OdooConnector } from './odoo-connector';
import { OdooResponse } from './odoo-response';
import { AuthenticateCallback } from './authenticate-callback';
export class OdooClient extends OdooConnector {
  constructor(serverURL: string) {
    super(serverURL);
  }

  async getSessionInfo(): Promise<OdooResponse> {
    let url = this.createPath('/web/session/get_session_info');
    return await this.callRequest(url, this.createPayload({}));
  }

  async authenticate(
    username: string,
    password: string,
    database: string
  ): Promise<AuthenticateCallback> {
    var url = this.createPath('/web/session/authenticate');
    var params = {
      db: database,
      login: username,
      password: password,
      context: {},
    };
    let response = await this.callRequest(url, this.createPayload(params));
    let session = await this.getSessionInfo();
    return new AuthenticateCallback(
      !response.hasError(),
      response,
      session.getSessionId()
    );
  }

  async read(
    model: string,
    ids: number[],
    fields: string[],
    kwargs?: any,
    context?: any[]
  ): Promise<OdooResponse> {
    return await this.callKW(model, 'read', [ids, fields], kwargs, context);
  }

  async callKW(
    model: string,
    method: string,
    args: any[],
    kwargs?: any,
    context?: any
  ): Promise<OdooResponse> {
    kwargs = kwargs == null ? {} : kwargs;
    context = context == null ? {} : context;
    var url = this.createPath('/web/dataset/call_kw/' + model + '/' + method);
    var params = {
      model: model,
      method: method,
      args: args,
      kwargs: kwargs,
      context: context,
    };
    return await this.callRequest(url, this.createPayload(params));
  }


async create(model: string, values: any):   Promise<OdooResponse> {
    return await this.callKW(model, "create", [values]);
  }
    // Write record with ids and values
    async write(model: string,  ids: number[], values: any): Promise<OdooResponse> {
        return await this.callKW(model, "write", [ids, values]);
      }
    
      // Remove record from system
      async unlink(model: string, ids: number[]): Promise<OdooResponse> {
        return await this.callKW(model, "unlink", [ids]);
      }
    
      // Call json controller
      async callController(path: string, params: any): Promise<OdooResponse> {
        return await this.callRequest(this.createPath(path), this.createPayload(params));
      }
}
