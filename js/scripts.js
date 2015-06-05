function Pizza(size) {
  this.size = size;
  this.toppings = [];
}

Pizza.prototype.addTopping = function(topping) {
  this.toppings.push(topping);
}

function Topping(type, cost) {
  this.type = type;
  this.cost = cost;
}
