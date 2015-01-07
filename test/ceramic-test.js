describe("New customer", function() {
  var business;
  var customer;

  before(function*() {
    yield setup();
    business = yield Account.create("FooBar Inc");
    customer = yield business.addCustomer("Mr. Baz");
  });

  it("should be the only customer", function*() {
    var count = yield Customer.count({ businessID: business.id });
    assert.equal(count, 1);
  });

  after(function*() {
    yield teardown();
  });

});
