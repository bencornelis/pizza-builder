function Pizza(size) {
  this.size = size;
  this.toppings = [];
}

Pizza.prototype.addTopping = function(topping) {
  this.toppings.push(topping);
}

Pizza.prototype.calculateCost = function() {
  var sizeCosts = {
    "small": 6,
    "medium": 10,
    "large": 14
  }

  var pizzaCost = sizeCosts[this.size];
  this.toppings.forEach(function(topping) { pizzaCost += topping.cost; });

  return pizzaCost;
}

function Topping(type, cost) {
  this.type = type;
  this.cost = cost;
}
