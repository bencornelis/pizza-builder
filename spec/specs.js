describe("Pizza", function() {
  it("has size and initially no toppings", function() {
    var pizza = new Pizza("small");
    expect(pizza.size).to.equal("small");
    expect(pizza.toppings).to.eql([]);
  });

  describe("#addTopping", function() {
    it("adds a topping to a pizza", function() {
      var pizza = new Pizza("small");
      var topping = new Topping("pepperoni", 2);
      pizza.addTopping(topping);
      expect(pizza.toppings).to.eql([topping]);
    });
  });

  describe("#calculateCost", function() {
    it("calculates cost based on pizza size", function() {
      var pizza = new Pizza("medium");
      expect(pizza.calculateCost()).to.equal(10);
    });

    it("adds on the cost of each pizza topping", function() {
      var pizza = new Pizza("small");
      var topping1 = new Topping("pepperoni", 2);
      var topping2 = new Topping("mushrooms", 1.5);
      pizza.addTopping(topping1);
      pizza.addTopping(topping2);
      expect(pizza.calculateCost()).to.equal(9.5);
    });
  });
});

describe("Topping", function() {
  it("has a type and cost", function() {
    var topping = new Topping("pepperoni", 2);
    expect(topping.type).to.equal("pepperoni");
    expect(topping.cost).to.equal(2);
  });
});
