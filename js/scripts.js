// Raw javascript

function Pizza(size, cheese) {
  this.size = size;
  this.toppings = [];
  this.cheese = typeof cheese !== "undefined" ? cheese : "regular";
}

Pizza.prototype.addTopping = function(topping) {
  this.toppings.push(topping);
}

Pizza.prototype.calculateCost = function() {
  var sizeCosts = {
    "extra-small": 4,
    "small": 6,
    "medium": 10,
    "large": 14,
    "extra-large": 16
  }

  var cheeseCharges = {
    "none": -2,
    "regular": 0,
    "extra": 2
  }

  var pizzaCost = sizeCosts[this.size];
  this.toppings.forEach(function(topping) { pizzaCost += topping.cost; });
  pizzaCost += cheeseCharges[this.cheese];

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


// Jquery event listeners

$(function() {
  var pizzaCart = new PizzaCart();

  $("form#new-pizza").change(function() {
    var currentPizza = createUserPizza();
    console.log(moneyFormat(currentPizza.calculateCost()));
    $("#pizza-price").text(moneyFormat(currentPizza.calculateCost()));
  });

  ["sizes", "cheese", "toppings", "pizza-cost"].forEach(function(menuPart) {
    $("#" + menuPart).click(function() {
      $("#" + menuPart).toggleClass("glyphicon-arrow-down");
      $("#" + menuPart).toggleClass("glyphicon-arrow-up");
      $("." + menuPart).toggle();
      $("#pizza-price").show();
    });
  });

  $("form#new-pizza").submit(function(event) {
    event.preventDefault();

    //add pizza to cart and display its info
    var newPizza = createUserPizza();
    pizzaCart.addPizza(newPizza);
    displayPizza(newPizza, pizzaCart);

    //update the cart section
    $("#total-cost").text("Total cost: " + moneyFormat(pizzaCart.calculateTotalCost()));
    $("#pizza-count").text(pizzaCart.pizzaCount());
    $("#added-pizzas").show();

    //on the first submit show popup with instructions
    if (pizzaCart.pizzaCount() === 1) {
      setTimeout(function() {
        $("#instruction-popup").fadeIn();
        setTimeout(function() { $("#instruction-popup").fadeOut(); }, 4000);
      }, 1000);
    }

    resetForm();
  });

  $("#checkout").click(function() {
    var pizzaCount = pizzaCart.pizzaCount();
    if (pizzaCount === 1) {
      $("#final-pizza-count").text(pizzaCart.pizzaCount() + " pizza");
    } else {
      $("#final-pizza-count").text(pizzaCart.pizzaCount() + " pizzas");
    }

    $("#final-cost").text(moneyFormat(pizzaCart.calculateTotalCost()));
    $("#modal").fadeIn();
  });

  $("#checkout-info #new-cart").click(function() {
    $("#modal").hide();
    $("#pizza-cart").empty();
    $("#added-pizzas").hide();
    ["sizes", "cheese", "toppings", "pizza-cost"].forEach(function(menuPart) {
      $("#" + menuPart).removeClass("glyphicon-arrow-up");
      $("#" + menuPart).addClass("glyphicon-arrow-down");
      $("." + menuPart).hide();
    });
    $("#pizza-price").hide();
    resetForm();
    pizzaCart = new PizzaCart();
  });
});



// Helper functions

var createUserPizza = function() {
  //create new pizza
  var size = $("input[name=size-options]:checked").val();
  var cheese = $("input[name=cheese-options]:checked").val();
  var newPizza = new Pizza(size, cheese);

  //add selected toppings
  $("input.topping:checked").each(function() {
    var type = $(this).attr("id");
    var cost = parseFloat($(this).val());
    newPizza.addTopping(new Topping(type, cost));
  });

  return newPizza;
}

var toppingsList = function(pizza) {
  var toppingsList = "<ul>";
  pizza.toppings.forEach(function(topping) {
    toppingsList += "<li>" + topping.display() + "</li>";
  });
  toppingsList += "</ul>";
  return toppingsList;
}

var displayPizza = function(pizza, pizzaCart) {

  var pizzaClasses = {
    "extra-small": "pizza-xs",
    "small": "pizza-sm",
    "medium": "pizza-md",
    "large": "pizza-lg",
    "extra-large": "pizza-xl"
  }

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
                              "<div class='" + pizzaClasses[pizza.size] + " pizza-image clickable'></div>" +
                            "</div>" +
                            "<div class='col-md-5 col-md-offset-1'>" +
                              pizzaDetails +
                            "</div>" +
                          "</div>");

  $("#pizza-cart div.pizza-image").last().hide();
  $("#pizza-cart div.pizza-image").last().fadeIn();

  //add pizza click handlers
  $("#pizza-cart div.pizza-image").last().hover(function() {
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

  $("input[name=cheese]").prop("checked", false);
  $("#regular").prop("checked", true);

  $("input.topping").prop("checked", false);

  $("#pizza-price").text("$10.00");
}
