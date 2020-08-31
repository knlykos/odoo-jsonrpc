import { OdooResponse } from './odoo-response';

export class OdooVersion {
  version: string;
  serverSerie: string;
  protocolVersion: number;
  major: string;
  minor: string;
  micro: string;
  releaseLevel: string;
  serial: string;
  _isEnterprise: boolean = false;

  getVersionInfo(): string {
    return this.version;
  }

  getServerSerie(): string {
    return this.serverSerie;
  }

  getProtocolVersion(): number {
    return this.protocolVersion;
  }

  getMajorVersion(): any {
    return this.major;
  }

  getMinorVersion(): any {
    return this.minor;
  }

  getMicroVersion(): string {
    return this.micro;
  }

  getReleaseLevel(): string {
    return this.releaseLevel;
  }

  getSerial() {
    return this.serial;
  }

  isEnterprise(): boolean {
    return this._isEnterprise;
  }

  parse(response: OdooResponse): OdooVersion {
    const result = response.getResult();
    debugger;
    this.version = result.server_version;
    this.serverSerie = result.server_serie;
    this.protocolVersion = result.protocol_version;
    const versionInfo: string[] = result.server_version_info;
    if (versionInfo.length === 6) {
      const versionInfoLenght = versionInfo.length;
      this._isEnterprise = versionInfo[versionInfoLenght - 1] === 'e';
    }

    this.major = versionInfo[0];
    this.minor = versionInfo[1];
    this.micro = versionInfo[2];
    this.releaseLevel = versionInfo[3];
    this.serial = versionInfo[4];
    return this;
  }
  constructor() {}

  toString() {
    if (this.version !== null) {
      return `${this.version} (${
        this._isEnterprise ? 'Enterprise' : 'Community'
      })`;
    }
  }
}
