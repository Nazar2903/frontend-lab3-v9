const services = [
  { id: 1, name: "Пошиття на замовлення", type: "Пошиття", readsDay1: 120, readsDay2: 95, duration: 14, cost: 1500 },
  { id: 2, name: "Пошиття за викрійкою клієнта", type: "Пошиття", readsDay1: 80, readsDay2: 110, duration: 10, cost: 1200 },
  { id: 3, name: "Пошиття штор та текстилю", type: "Пошиття", readsDay1: 60, readsDay2: 75, duration: 12, cost: 900 },
  { id: 4, name: "Пошиття дитячого одягу", type: "Пошиття", readsDay1: 45, readsDay2: 50, duration: 7, cost: 800 },
  { id: 5, name: "Підгін розміру", type: "Ремонт", readsDay1: 150, readsDay2: 140, duration: 3, cost: 300 },
  { id: 6, name: "Ремонт блискавок", type: "Ремонт", readsDay1: 130, readsDay2: 160, duration: 2, cost: 200 },
  { id: 7, name: "Заміна підкладки", type: "Ремонт", readsDay1: 40, readsDay2: 35, duration: 3, cost: 450 },
  { id: 8, name: "Реставрація виробів", type: "Реставрація", readsDay1: 70, readsDay2: 65, duration: 7, cost: 800 },
  { id: 9, name: "Реставрація шкіряних виробів", type: "Реставрація", readsDay1: 30, readsDay2: 45, duration: 10, cost: 1100 },
  { id: 10, name: "Консультація стиліста", type: "Консультація", readsDay1: 90, readsDay2: 85, duration: 1, cost: 250 }
];

const fields = ["id", "name", "type", "readsDay1", "readsDay2", "duration", "cost"];

function sortByDuration(list) {
  return [...list].sort((a, b) => a.duration - b.duration);
}

function averageReadersByDuration(list) {
  const groups = {};
  list.forEach(s => {
    if (!groups[s.duration]) groups[s.duration] = [];
    groups[s.duration].push((s.readsDay1 + s.readsDay2) / 2);
  });
  const result = [];
  for (const duration in groups) {
    const sum = groups[duration].reduce((a, b) => a + b, 0);
    result.push({ duration: Number(duration), average: sum / groups[duration].length });
  }
  return result;
}

function findMaxReadsDay2(list) {
  return list.reduce((max, s) => (s.readsDay2 > max.readsDay2 ? s : max));
}

function addService(list, service) {
  const isFull = fields.every(f => service[f] !== undefined && service[f] !== "");
  if (!isFull) {
    list.push(service);
    return;
  }
  const index = list.findIndex(s => s.cost > service.cost);
  if (index === -1) list.push(service);
  else list.splice(index, 0, service);
}

function calcDurationByType(list) {
  const counts = {};
  list.forEach(s => {
    counts[s.type] = (counts[s.type] || 0) + 1;
  });
  return list.map(s => {
    let k = 2;
    if (counts[s.type] === 1) k = 1;
    else if (counts[s.type] <= 3) k = 1.1;
    return { name: s.name, type: s.type, count: counts[s.type], duration: s.duration, newDuration: +(s.duration * k).toFixed(1) };
  });
}

console.log("Завдання 1");

console.log("\n1. Сервіси, впорядковані за терміном тривалості надання:");
console.table(sortByDuration(services), ["name", "duration"]);
console.log("Середня кількість читачів для однакового терміну:");
console.table(averageReadersByDuration(services));

console.log("\n2. Сервіс з максимальною кількістю читачів за добу_2:");
const maxService = findMaxReadsDay2(services);
console.log(`${maxService.name} (${maxService.readsDay2} читачів), тип: ${maxService.type}`);

console.log("\n3. Додавання нових записів у список, відсортований за вартістю:");
const byCost = [...services].sort((a, b) => a.cost - b.cost);
addService(byCost, { id: 11, name: "Вишивка на одязі", type: "Пошиття", readsDay1: 55, readsDay2: 70, duration: 5, cost: 600 });
addService(byCost, { id: 12, name: "Пошиття весільної сукні", type: "Пошиття", readsDay1: 25, readsDay2: 40, duration: 30 });
console.table(byCost, ["id", "name", "cost"]);

console.log("\n4. Тривалість надання сервісів одночасно за їх типом:");
console.table(calcDurationByType(services));

class User {
  constructor(surname, name, age, email, purpose, date, time) {
    this.surname = surname;
    this.name = name;
    this.age = age;
    this.email = email;
    this.purpose = purpose;
    this.date = date;
    this.time = time;
  }

  getDateTime() {
    return new Date(`${this.date}T${this.time}`);
  }

  getCategory() {
    if (this.age < 25 && this.purpose === "побажання") return "активна молодь";
    if (this.age > 60 && this.purpose === "претензія") return "похилий претензійний";
    if (this.age > 25 && this.age < 60 && this.purpose !== "претензія") return "середній без претензій";
    return "інші";
  }
}

class UserList {
  constructor(users) {
    this.users = users;
  }

  findByMonthAndHour(month, hour) {
    return this.users.filter(u => u.getDateTime().getMonth() + 1 === month && u.getDateTime().getHours() === hour);
  }

  findYoungest() {
    return this.users.reduce((min, u) => (u.age < min.age ? u : min));
  }

  countByCategory() {
    const counts = { "активна молодь": 0, "похилий претензійний": 0, "середній без претензій": 0, "інші": 0 };
    this.users.forEach(u => counts[u.getCategory()]++);
    return counts;
  }

  sortByEmail() {
    return [...this.users].sort((a, b) => a.email.localeCompare(b.email));
  }
}

const users = new UserList([
  new User("Шевченко", "Олена", 22, "olena.shevchenko@gmail.com", "побажання", "2026-10-05", "14:20"),
  new User("Коваленко", "Іван", 67, "ivan.kovalenko@ukr.net", "претензія", "2026-10-12", "09:45"),
  new User("Бондаренко", "Марія", 34, "maria.bond@gmail.com", "питання", "2026-09-18", "14:05"),
  new User("Ткаченко", "Андрій", 19, "andriy.tk@gmail.com", "побажання", "2026-10-21", "14:50"),
  new User("Кравчук", "Степан", 45, "stepan.kravchuk@ukr.net", "подяка", "2026-11-02", "11:30"),
  new User("Олійник", "Ганна", 72, "hanna.oliynyk@gmail.com", "претензія", "2026-08-27", "16:10"),
  new User("Мельник", "Юрій", 29, "yuriy.melnyk@outlook.com", "претензія", "2026-10-09", "18:40"),
  new User("Лисенко", "Софія", 17, "sofia.lysenko@gmail.com", "претензія", "2026-07-14", "12:00"),
  new User("Савченко", "Петро", 58, "petro.savchenko@ukr.net", "побажання", "2026-10-30", "10:15"),
  new User("Руденко", "Дарина", 63, "daryna.rudenko@gmail.com", "побажання", "2026-11-19", "14:35")
]);

console.log("\nЗавдання 2");

console.log("\n1. Користувачі, що звернулись у жовтні (10) о 14-й годині:");
console.table(users.findByMonthAndHour(10, 14), ["surname", "name", "date", "time"]);

console.log("\n2. Користувач з мінімальним віком:");
const youngest = users.findYoungest();
console.log(`Вік: ${youngest.age}, E-mail: ${youngest.email}, дата звернення: ${youngest.date}`);

console.log("\n3. Кількість користувачів у кожному класі:");
console.table(users.countByCategory());

console.log("\n4. Користувачі в алфавітному порядку E-mail:");
console.table(users.sortByEmail(), ["email", "purpose"]);
