import { OdooClient } from "./odoo-client";

const odooClient = new OdooClient('http://172.17.0.3:8069')
const databases = odooClient.getDatabases().then(res => {
    console.log(res);
});
