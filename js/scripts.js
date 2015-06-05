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

function PizzaCart() {
  this.pizzas = [];
}

PizzaCart.prototype.addPizza = function(pizza) {
  this.pizzas.push(pizza);
}

PizzaCart.prototype.calculateTotalCost = function() {
  var totalCost = 0;
  this.pizzas.forEach(function(pizza) { totalCost += pizza.calculateCost(); });
  return totalCost;
}

var moneyFormat = function(number) {
  return "$" + (number).toFixed(2);
}

var createUserPizza = function() {
  //create new pizza
  var size = $("input[name=size-options]:checked").val();
  var newPizza = new Pizza(size);

  //add selected toppings
  $("input.topping:checked").each(function() {
    var type = $(this).attr("id");
    var cost = parseFloat($(this).val());
    newPizza.addTopping(new Topping(type, cost));
  });

  return newPizza
}

$(function() {
  var pizzaCart = new PizzaCart();

  $("form#new-pizza").change(function() {
    var currentPizza = createUserPizza();
    $("#pizza-price").text("Pizza cost: " + moneyFormat(currentPizza.calculateCost()));
  });

  $("form#new-pizza").submit(function(event) {
    event.preventDefault();
    pizzaCart.addPizza(createUserPizza());
  });


});
