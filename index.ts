import { OdooClient } from './odoo-client';

const odooClient = new OdooClient('http://localhost:8069');
const databases = odooClient.getDatabases().then((res) => {
  console.log(res);
});

odooClient.authenticate('administrator', '12345678', 'nkodex').then((res) => {
  console.log(res);
  odooClient
    .searchRead(
      'product.template',
    [['type', 'in', ['consu', 'product']]],
      [
        'id',
        'product_variant_count',
        'currency_id',
        'activity_state',
        'name',
        'default_code',
        'lst_price',
        'qty_available',
        'uom_id',
        'type',
      ],
      0,
      80
    )
    .then((res) => {
      console.log(JSON.stringify(res.result));
    });
});
