let customerId = 0;
class Customer {
  constructor(name, employer) {
    this.id = ++customerId;
    this.name = name;
    if (employer) {
      this.employerId = employer.id;
    }
    store.customers.push(this);
  }

  totalSpent() {
    const deliveries = store.deliveries.filter(
      delivery => delivery.customerId && delivery.customerId === this.id
    );
    const meals = deliveries.map(function(delivery) {
      return store.meals.find(function(meal) {
        return delivery.mealId === meal.id;
      });
    });
    return meals.reduce(function(agg, meal) {
      return agg + meal.price;
    }, 0);
  }

  deliveries() {
    return store.deliveries.filter(delivery => delivery.customerId === this.id);
  }

  meals() {
    return this.deliveries().map(delivery => delivery.meal());
  }
}

let deliveryId = 0;
class Delivery {
  constructor(meal, customer) {
    this.id = ++deliveryId;
    if (meal) {
      this.mealId = meal.id;
    }
    if (customer) {
      this.customerId = customer.id;
    }
    store.deliveries.push(this);
  }

  customer() {
    return store.customers.find(customer => customer.id === this.customerId);
  }

  meal() {
    return store.meals.find(meal => meal.id === this.mealId);
  }
}

let mealId = 0;
class Meal {
  constructor(title, price) {
    this.id = ++mealId;
    this.title = title;
    this.price = price;
    store.meals.push(this);
  }

  static byPrice() {
    const sorted = store.meals.sort((a, b) => b.price - a.price);
    return sorted;
  }

  deliveries() {
    return store.deliveries.filter(delivery => delivery.mealId === this.id);
  }

  customers() {
    return this.deliveries().map(delivery => delivery.customer());
  }
}

let employerId = 0;
class Employer {
  constructor(name) {
    this.id = ++employerId;
    this.name = name;
    store.employers.push(this);
  }

  employees() {
    return store.customers.filter(employee => employee.employerId === this.id);
  }

  employeeMeals() {
    return this.employees()
      .map(employee => employee.meals())
      .reduce((a, b) => a.concat(b));
  }

  mealTotals() {
    const returnObj = {};
    for (const meal of this.employeeMeals()) {
      returnObj[meal.id] = ++returnObj[meal.id] || 1;
    }
    return returnObj;
  }
}

let store = {
  customers: [],
  deliveries: [],
  meals: [],
  employers: []
};
