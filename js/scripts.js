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

Topping.prototype.display = function() {
  return this.type + ", " + moneyFormat(this.cost);
}

function PizzaCart() {
  this.pizzas = [];
}

PizzaCart.prototype.addPizza = function(pizza) {
  this.pizzas.push(pizza);
}

PizzaCart.prototype.removePizza = function(pizza) {
  var pizzaIndex = this.pizzas.indexOf(pizza);
  this.pizzas.splice(pizzaIndex, 1);
}

PizzaCart.prototype.pizzaCount = function() {
  return this.pizzas.length;
}

PizzaCart.prototype.calculateTotalCost = function() {
  var totalCost = 0;
  this.pizzas.forEach(function(pizza) { totalCost += pizza.calculateCost(); });
  return totalCost;
}

var moneyFormat = function(number) {
  return "$" + (number).toFixed(2);
}

$(function() {
  var pizzaCart = new PizzaCart();

  $("form#new-pizza").change(function() {
    var currentPizza = createUserPizza();
    $("#pizza-price").text("Pizza cost: " + moneyFormat(currentPizza.calculateCost()));
  });

  $("form#new-pizza").submit(function(event) {
    event.preventDefault();
    var newPizza = createUserPizza();
    pizzaCart.addPizza(newPizza);
    displayPizza(newPizza, pizzaCart);

    $("#total-cost").text("Total cost: " + moneyFormat(pizzaCart.calculateTotalCost()));
    $("#pizza-count").text(pizzaCart.pizzaCount());
    $("#added-pizzas").show();
    resetForm();
  });

});


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

  return newPizza;
}

var toppingsList = function(pizza) {
  var toppingsList = "<ul class='list-unstyled'>";
  pizza.toppings.forEach(function(topping) {
    toppingsList += "<li>" + topping.display() + "</li>";
  });
  toppingsList += "</ul>";
  return toppingsList;
}

var displayPizza = function(pizza, pizzaCart) {


  var pizzaDetails = "<ul class='float details list-unstyled list-group'>" +
                       "<li class='list-group-item'>" +
                          "Size: " + pizza.size +
                       "</li>";

  if (pizza.toppings.length > 0) {
    pizzaDetails += "<li class='list-group-item'> Toppings: " +
                      toppingsList(pizza) +
                    "</li>";
  } else {
    pizzaDetails += "<li class='list-group-item'> No toppings </li>";
  }

  pizzaDetails += "<li class='list-group-item'> Cost: " + moneyFormat(pizza.calculateCost()) + "</li></ul>";


  $("#pizza-cart").append("<div class='pizza row'>" +
                            "<div class='col-md-6'>" +
                              "<span class='remove clickable glyphicon glyphicon-remove pull-left' aria-hidden='true'></span>" +
                              "<div class='float pizza-image clickable'></div>" +
                            "</div>" +
                            "<div class='col-md-5 col-md-offset-1'>" +
                              pizzaDetails +
                            "</div>" +
                          "</div>" );

  //add pizza click handlers
  $("#pizza-cart div.pizza-image").last().click(function() {
    $(this).parents(".pizza").find("ul.details").fadeToggle();
  });

  $(".glyphicon-remove").last().click(function() {
    $(this).parents(".pizza").remove();
    pizzaCart.removePizza(pizza);
    $("#total-cost").text("Total cost: " + moneyFormat(pizzaCart.calculateTotalCost()));
    $("#pizza-count").text(pizzaCart.pizzaCount());
  });
}

var resetForm = function() {
  $("input[name=size-options]").prop("checked", false);
  $("#medium").prop("checked", true);

  $("input.topping").prop("checked", false);

  $("#pizza-price").text("Pizza cost: $10.00");
}
