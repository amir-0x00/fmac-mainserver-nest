{
  const product = {
    quantity: 0,
    cost: 0,
    cost_all: 0,
  };
  const invoice_list = [
    { price: 100, quantity: 10 },
    { price: 50, quantity: 10 },
  ];

  function add_remove_invoice({ price, quantity }, multiplier = 1) {
    product.cost_all = product.cost * product.quantity + price * multiplier;
    product.quantity += quantity * multiplier;
    product.cost = product.cost_all / product.quantity || 0;
    console.log(product);
    return product;
  }

  const add_invoice = ({ price, quantity }) => {
    add_remove_invoice({ price, quantity });
  };
  const remove_invoice = ({ price, quantity }) => {
    add_remove_invoice({ price, quantity }, -1);
  };
  const sale_invoice = (quantity) => {
    product.quantity -= quantity;
  };

  // add_remove_invoice({price:20, quantity:10})
  add_invoice({ price: 100, quantity: 10 });
  sale_invoice(6);
  add_invoice({ price: 50, quantity: 10 });
  // add_invoice({price:50, quantity:10})
  remove_invoice({ price: 50, quantity: 10 });
  // remove_invoice({price:50, quantity:10})
  // add_invoice({price:50, quantity:10})

  console.log(product);
}
