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
});

describe("Topping", function() {
  it("has a type and cost", function() {
    var topping = new Topping("pepperoni", 2);
    expect(topping.type).to.equal("pepperoni");
    expect(topping.cost).to.equal(2);
  });
});
