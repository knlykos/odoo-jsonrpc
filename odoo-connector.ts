import { OdooVersion } from './odoo-version';
import { v1  } from 'uuid';
import { OdooResponse } from './odoo-response';
import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

export class OdooConnector {
  private serverURL: string;
  private headers: any;
  private debugRPC: boolean = false;
  private odooVersion: OdooVersion = new OdooVersion();
  private databases: any[] = [];
  private sessionId: string = '';

  constructor(serverURL: string) {
    this.serverURL = serverURL;
  }

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  async connect(): Promise<OdooVersion> {
    const odooVersion = await this.getVersionInfo();
    this.databases = await this.getDatabases();
    return odooVersion;
  }

  async getDatabases(): Promise<any[]> {
    if (this.odooVersion.getMajorVersion() == null) {
      this.odooVersion = await this.getVersionInfo();
    }
    let url: string = this.getServerURL();
    var params: any = {};
    debugger;
    if (this.odooVersion.getMajorVersion() == 9) {
      url = this.createPath('/jsonrpc');
      params['method'] = 'list';
      params['service'] = 'db';
      params['args'] = [];
    } else if (this.odooVersion.getMajorVersion() >= 10) {
      url = this.createPath('/web/database/list');
      params['context'] = {};
    } else {
      url = this.createPath('/web/database/get_list');
      params['context'] = {};
    }
    const response = await this.callRequest(url, this.createPayload(params));
    debugger;
    this.databases = response.getResult();
    return this.databases;
  }

  async getVersionInfo(): Promise<OdooVersion> {
    let url = this.createPath('/web/webclient/version_info');
    console.log(url);
    let response = await this.callRequest(url, this.createPayload({}));
    const odooVersion = new OdooVersion();
    const odooVersionParsed = odooVersion.parse(response);
    return odooVersionParsed;
  }

  getServerURL(): string {
    return this.serverURL;
  }

  createPath(path: string): string {
    return this.serverURL + path;
  }

  createPayload(params: any) {
    return {
      jsonrpc: '2.0',
      method: 'call',
      params: params,
      id: v1(),
    };
  }

  async callRequest(url: string, payload: any): Promise<OdooResponse> {
    var body = payload;
    this.headers = { 'Content-type': 'application/json' };
    if (this.sessionId != null) {
      this.headers = { Cookie: 'session_id=' + this.sessionId };
    }
    if (this.debugRPC) {
      console.log('-------------------------------------------');
      console.log('REQUEST: $url');
      console.log('PAYLOD : $payload');
      console.log('HEADERS: $_headers');
      console.log('-------------------------------------------');
    }
    // const response = (await axios.post(url, body, this.headers)).data;

    const axiosRequestConfig: AxiosRequestConfig = {
      url: url,
      data: body,
      headers: this.headers,
    };
    // const data = await axios.create(axiosRequestConfig);
    // data.
    // const axiosInstance = axios as AxiosInstance;
    // const axiosInstance = axios.create(axiosRequestConfig);

    const data = await axios.post(url, body, axiosRequestConfig);
    console.log(data);

    const response = data.data;
    console.log(data.data);
    // const response = await client.post(url, body: body, headers: _headers);
    this.sessionId = this._updateCookies(data) as string;
    if (this.debugRPC) {
      console.log('============================================');
      console.log('STATUS_C: ${response.statusCode}');
      console.log('RESPONSE: ${response.body}');
      console.log('============================================');
    }
    debugger;
    return new OdooResponse(response, data.status, this.sessionId);
  }

  _updateCookies(response: any) {
    const rawCookie: string = response.headers['set-cookie'][0];
    if (rawCookie != null) {
      const index: number = rawCookie.indexOf(';');
      const cookie: string =
        index == -1 ? rawCookie : rawCookie.substring(0, index);
      this.headers['Cookie'] = cookie;
      if (index > -1) {
        return cookie.split('=')[1];
      }
    }
    return null;
  }
}
