import { OdooResponse } from './odoo-response';

export class OdooUser {
  name: string = '';
  sessionId: string = '';
  uid: string = '';
  database: string = '';
  username: string = '';
  companyId: string = '';
  partnerId: string = '';
  lang: string = '';
  tz: string = '';

  parse(response: OdooResponse, sessionId: string): OdooUser {
    if (!response.hasError()) {
      this.sessionId = sessionId;
      const data = response.getResult();
      this.name = data['name'];
      this.uid = data['uid'];
      this.database = data['db'];
      this.username = data['username'];
      this.companyId = data['company_id'];
      this.partnerId = data['partner_id'];
      this.lang = data['user_context']['lang'];
      this.tz = data['user_context']['tz'];
    }
    return this;
  }

  toString() {
    var map = {
      name: name,
      uid: this.uid,
      partner_id: this.partnerId,
      company_id: this.companyId,
      username: this.username,
      lang: this.lang,
      timezone: this.tz,
      database: this.database,
      session_id: this.sessionId,
    };
    return map.toString();
  }
}
