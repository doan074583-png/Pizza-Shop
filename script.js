const ingredients = [
  { id: 'sauce', name: 'Tomato sauce', className: 'sauce' },
  { id: 'cheese', name: 'Cheese', className: 'cheese' },
  { id: 'pepperoni', name: 'Pepperoni', className: 'pepperoni' },
  { id: 'mushroom', name: 'Mushrooms', className: 'mushroom' },
  { id: 'onion', name: 'Onions', className: 'onion' },
  { id: 'pepper', name: 'Bell peppers', className: 'pepper' },
  { id: 'sausage', name: 'Sausage', className: 'sausage' },
  { id: 'olive', name: 'Olives', className: 'olive' },
  { id: 'basil', name: 'Fresh basil', className: 'basil' }
];
const customers = ['Mia', 'Leo', 'Ruby', 'Sam', 'Nora', 'Theo', 'Ava', 'Max'];
const orderSets = [
  ['sauce', 'cheese'], ['sauce', 'cheese', 'pepperoni'], ['sauce', 'cheese', 'mushroom', 'onion'],
  ['sauce', 'cheese', 'pepper', 'sausage'], ['sauce', 'cheese', 'olive', 'basil'], ['sauce', 'cheese', 'pepperoni', 'mushroom']
];
let order = []; let selected = null; let placed = []; let money = 0; let score = 0; let day = 1; let busy = false;
const $ = (id) => document.getElementById(id);
const ingredientById = (id) => ingredients.find((item) => item.id === id);

function renderIngredientTrays() {
  $('ingredientGrid').innerHTML = ingredients.map((item) => `
    <button class="ingredient" type="button" data-id="${item.id}" aria-label="Select ${item.name}">
      <span class="ingredient-graphic ${item.className}" aria-hidden="true"></span><span class="ingredient-name">${item.name}</span>
    </button>`).join('');
  document.querySelectorAll('.ingredient').forEach((button) => button.addEventListener('click', () => selectIngredient(button.dataset.id)));
}
function newOrder() {
  order = [...orderSets[Math.floor(Math.random() * orderSets.length)]];
  $('customerName').textContent = `${customers[Math.floor(Math.random() * customers.length)]} is hungry!`;
  $('orderText').textContent = order.length === 2 ? 'Make a classic cheese pizza' : 'Make a delicious custom pizza';
  $('orderChips').innerHTML = order.map((id) => `<span class="order-chip">${ingredientById(id).name}</span>`).join('');
  $('mood').textContent = 'READY!'; $('mood').className = 'mood happy';
}
function selectIngredient(id) {
  if (busy) return;
  selected = id;
  document.querySelectorAll('.ingredient').forEach((button) => button.classList.toggle('selected', button.dataset.id === id));
  $('placementHint').textContent = `${ingredientById(id).name} selected — tap dough`;
}
function placeIngredient(event) {
  if (!selected || busy) { if (!selected) setMessage('Choose an ingredient tray first, then tap the dough.', false); return; }
  const pizza = $('pizza'); const rect = pizza.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100; const y = ((event.clientY - rect.top) / rect.height) * 100;
  const edge = Math.hypot(x - 50, y - 50);
  if (edge > 42) return;
  const item = ingredientById(selected); placed.push(selected);
  const topping = document.createElement('span'); topping.className = `placed-topping ingredient-graphic ${item.className}`;
  topping.style.left = `${x}%`; topping.style.top = `${y}%`; topping.style.width = '49px'; topping.style.height = '43px'; topping.setAttribute('aria-label', item.name);
  $('toppings').appendChild(topping);
  if (selected === 'sauce') $('pizza').classList.add('has-sauce');
  $('placementHint').textContent = `${item.name} added! Choose another ingredient`;
  selected = null; document.querySelectorAll('.ingredient').forEach((button) => button.classList.remove('selected'));
}
function setMessage(text, success) { $('message').textContent = text; $('message').style.background = success ? '#ddf3e6' : '#fff0d6'; $('message').style.color = success ? '#4f987f' : '#986c4e'; }
function clearPizza() {
  if (busy) return; placed = []; selected = null; $('toppings').innerHTML = ''; $('pizza').classList.remove('has-sauce');
  document.querySelectorAll('.ingredient').forEach((button) => button.classList.remove('selected')); $('placementHint').textContent = 'Choose an ingredient'; setMessage('Fresh dough, fresh start! Pick your ingredients.', false);
}
function bakePizza() {
  if (busy) return;
  const unique = [...new Set(placed)]; const missing = order.filter((id) => !unique.includes(id)); const extra = unique.filter((id) => !order.includes(id));
  if (!unique.length) { setMessage('Your pizza needs some toppings before it goes in the oven!', false); return; }
  busy = true; $('bakeBtn').disabled = true; $('clearBtn').disabled = true; $('pizza').classList.add('baking'); setMessage('Baking your pizza... listen for that sizzle!', true);
  setTimeout(() => {
    $('pizza').classList.remove('baking'); $('bakeBtn').disabled = false; $('clearBtn').disabled = false; busy = false;
    if (!missing.length && !extra.length) { money += 12; score += 100; $('money').textContent = money; $('score').textContent = score; $('mood').textContent = 'YUM!'; $('mood').className = 'mood happy'; setMessage('Perfect order! Customer is delighted. +$12 and +100 points!', true); setTimeout(() => { day += 1; $('day').textContent = day; clearPizza(); newOrder(); }, 1700); }
    else { const notes = []; if (missing.length) notes.push(`missing ${missing.map((id) => ingredientById(id).name).join(', ')}`); if (extra.length) notes.push(`remove ${extra.map((id) => ingredientById(id).name).join(', ')}`); $('mood').textContent = 'OH NO!'; $('mood').className = 'mood sad'; setMessage(`Almost! Please ${notes.join(' and ')}. Clear the pizza and try again.`, false); }
  }, 900);
}
renderIngredientTrays(); newOrder(); $('pizza').addEventListener('click', placeIngredient); $('clearBtn').addEventListener('click', clearPizza); $('bakeBtn').addEventListener('click', bakePizza);
