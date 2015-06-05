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

  return newPizza;
}

var displayPizza = function(pizza) {


  var pizzaDetails = "<ul class='float details list-unstyled list-group'>" +
                       "<li class='list-group-item'> Size: " + pizza.size + "</li>";
  if (pizza.toppings.length > 0) {
    var toppingsList = "<ul class='list-unstyled'>";
    pizza.toppings.forEach(function(topping) {
      toppingsList += "<li>" + topping.type + ", " + moneyFormat(topping.cost);
    });
    toppingsList += "</ul>";
    pizzaDetails += "<li class='list-group-item'> Toppings: " +
                      toppingsList +
                    "</li>";
  } else {
    pizzaDetails += "<li class='list-group-item'> No toppings </li>";
  }

  pizzaDetails += "<li class='list-group-item'> Cost: " + moneyFormat(pizza.calculateCost()) + "</li></ul>";


  $("#pizza-cart").append("<div class='pizza row'>" +
                            "<div class='col-md-6'>" +
                              "<div class='float pizza-image clickable'></div>" +
                            "</div>" +
                            "<div class='col-md-5 col-md-offset-1'>" +
                              pizzaDetails +
                            "</div>" +
                          "</div>" );

  $("#pizza-cart div.pizza-image").last().click(function() {
    $(this).parents(".pizza").find("ul.details").fadeToggle();
  });
}

var resetForm = function() {
  $("input[name=size-options]").prop("checked", false);
  $("#medium").prop("checked", true);

  $("input.topping").prop("checked", false);

  $("#pizza-price").text("Pizza cost: $10.00");
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
    displayPizza(newPizza);

    resetForm();
  });


});
