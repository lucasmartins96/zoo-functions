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

const { animals, employees, prices, hours } = require('./data');
// const data = require('./data');

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

function showAnimalsLocationReducer() {
  return animals.reduce((objReduce, { location, name }) => {
    const animalLocation = objReduce;
    if (!animalLocation[location]) animalLocation[location] = [];
    animalLocation[location].push(name);
    return animalLocation;
  }, {});
}

const generateAnimalNamesByCriteria = (arrTarget, criterion, sorted) => {
  const animalsFilteredBySex = (
    criterion ? arrTarget.filter(({ sex }) => sex === criterion) : false
  );
  const animalsNames = (
    animalsFilteredBySex ? animalsFilteredBySex.map((resident) => resident.name)
      : arrTarget.map((resident) => resident.name)
  );
  const sortedNames = animalsNames.slice().sort();
  return (sorted ? sortedNames : animalsNames);
};

function animalMap(options) {
  if (!options || !options.includeNames) return showAnimalsLocationReducer();

  return animals.reduce((objReduce, { location }) => {
    const animalLocation = objReduce;
    const animalsPerLocation = animals.filter((animal) => (animal.location === location));
    const animalsAndYourNames = animalsPerLocation.map(({ name, residents }) => {
      const newArr = generateAnimalNamesByCriteria(residents, options.sex, options.sorted);
      return { [name]: newArr };
    });
    if (!animalLocation[location]) animalLocation[location] = animalsAndYourNames;
    return animalLocation;
  }, {});
}

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

  // return prices;
}

function searchEmployeeByIdOrName(foundObj) {
  const { firstName, lastName, responsibleFor } = foundObj;
  const specieArr = responsibleFor.reduce((newArr, animalId) => {
    const animalFound = animals.find(({ id }) => id === animalId);
    return newArr.concat(animalFound.name);
  }, []);
  return { [`${firstName} ${lastName}`]: specieArr };
}

function employeeCoverage(idOrName) {
  const foundEmployeeByIdOrName = employees.find(({ id, firstName, lastName }) =>
    id === idOrName || firstName === idOrName || lastName === idOrName);

  const reducer = (newObj, { firstName, lastName, responsibleFor }) => {
    const specieArr = responsibleFor.reduce((newArr, animalId) => {
      const animalFound = animals.find(({ id }) => id === animalId);
      return newArr.concat(animalFound.name);
    }, []);
    return Object.assign(newObj, { [`${firstName} ${lastName}`]: specieArr });
  };

  const employeesResponsible = employees.reduce(reducer, {});
  if (!idOrName) return employeesResponsible;

  return searchEmployeeByIdOrName(foundEmployeeByIdOrName);
}

module.exports = {
  entryCalculator,
  schedule,
  animalCount,
  animalMap,
  animalsByIds,
  employeeByName,
  employeeCoverage,
  addEmployee,
  isManager,
  animalsOlderThan,
  oldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
