/*
eslint no-unused-vars: [
  "error",
  {
    "args": "none",
    "vars": "local",
    "varsIgnorePattern": "data"
  }
]
*/

const { employees, prices, hours } = require('./data');
const data = require('./data');

const { animals } = data;

function animalsByIds(...ids) {
  if (ids.length < 1) {
    return [];
  }
  return animals.filter((animal) => ids.includes(animal.id));
}

function animalsOlderThan(animal, age) {
  return animals.find((specie) => specie.name === animal)
    .residents.every((name) => name.age > age);
}

function employeeByName(employeeName) {
  if (employeeName === undefined) {
    return {};
  }

  function fetchEmployee({ firstName, lastName }) {
    return firstName === employeeName || lastName === employeeName;
  }
  return employees.find(fetchEmployee);
}

function createEmployee(personalInfo, associatedWith) {
  return { ...personalInfo, ...associatedWith };
}

function isManager(id) {
  // Crédito ao colega Jefferson Andrade que compartilhou a sua solução
  return employees.some((employee) => employee.managers.includes(id));
}

function addEmployee(id, firstName, lastName, managers = [], responsibleFor = []) {
  return employees.push({
    id,
    firstName,
    lastName,
    managers,
    responsibleFor,
  });
}

function animalCount(species) {
  const amountAnimals = {};
  if (species === undefined) {
    animals.forEach(({ name, residents }) => {
      amountAnimals[name] = residents.length;
    });
    return amountAnimals;
  }
  const foundAnimal = animals.find((animal) => animal.name === species);
  return foundAnimal.residents.length;
}

function entryCalculator(entrants) {
  if (entrants === undefined || entrants === {}) return 0;

  let total = 0;
  const entrantsKeys = Object.keys(entrants);
  entrantsKeys.forEach((key) => {
    total += prices[key] * entrants[key];
  });
  return total;
}
/*
function animalMap(options) {
  // seu código aqui
} */

function schedule(dayName) {
  const obj = {};
  const hoursKeys = Object.keys(hours);
  hoursKeys.forEach((key) => {
    const { open, close } = hours[key];
    if (key === 'Monday') {
      obj[key] = 'CLOSED';
    } else {
      obj[key] = `Open from ${open}am until ${close - 12}pm`;
    }
  });
  if (dayName) return { [dayName]: obj[dayName] };
  return obj;
}

function oldestFromFirstSpecies(id) {
  const findOldest = (acc, resident) => (acc.age > resident.age ? acc : resident);

  const emp = employees.find((employee) => employee.id === id);
  const firstSpecie = emp.responsibleFor.find((idAnimal) => idAnimal);
  const foundAnimal = animals.find((animal) => animal.id === firstSpecie);
  const oldestResident = foundAnimal.residents.reduce(findOldest);
  const { name, sex, age } = oldestResident;
  return [name, sex, age];
}

function increasePrices(percentage) {
  // Crédito ao colega Arlen Freitas que compartilhou a sua solução
  const { Adult, Senior, Child } = prices;

  prices.Adult = Math.ceil(Adult * (percentage + 100)) / 100;
  prices.Senior = Math.ceil(Senior * (percentage + 100)) / 100;
  prices.Child = Math.ceil(Child * (percentage + 100)) / 100;

  return prices;
}
/*
function employeeCoverage(idOrName) {
  // seu código aqui
}
 */
module.exports = {
  entryCalculator,
  schedule,
  animalCount,
  // animalMap,
  animalsByIds,
  employeeByName,
  // employeeCoverage,
  addEmployee,
  isManager,
  animalsOlderThan,
  oldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
