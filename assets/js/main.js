/* eslint-disable no-console */
var form = document.querySelector('form');
var formItem = document.querySelector('#item');
var formAmount = document.querySelector('#amount');
var countEl = document.querySelector('#items-number');
var itemsEl = document.querySelector('#all-items');
var totalAmountEl = document.querySelector('#total');

const KEY = 'budget';
var item, amount, currentSubmission;
var count = 0;
var ALL_ITEMS = [];

document.addEventListener('DOMContentLoaded', function(){
  if(getStoredItems(KEY)) {
    ALL_ITEMS = JSON.parse(getStoredItems(KEY));
    count = ALL_ITEMS.length;
    updateCount();
    updateList(ALL_ITEMS);
    updateTotal(ALL_ITEMS);
  }
});

form.addEventListener('submit', (e) => {
  item = formItem.value;
  amount = Number(formAmount.value);

  currentSubmission = new Item(item, amount);
  ALL_ITEMS.push(currentSubmission);

  clearForm();
  updateCount();
  updateList(ALL_ITEMS);
  updateTotal(ALL_ITEMS);
  store(ALL_ITEMS);
  e.preventDefault();
});

// BUDGET CLASS
class Item {
  constructor(item, amount) {
    this.item = item;
    this.amount = amount;
  }
}

// FUNCTIONS
function magic(index) {
  var itemToDisplay = ALL_ITEMS[index].item + ' - ' + ALL_ITEMS[index].amount;
  document.querySelector('#item-confirmation').innerHTML = itemToDisplay;

  document.querySelector('#confirmation').classList.add('shown');
  document.querySelector('.container').classList.add('confirm');
}

function demo() {
  var trashEl = document.querySelectorAll('.ti-trash');

  for(var i = 0; i < trashEl.length; i++) {
    trashEl[i].addEventListener('click', magic(i));
  }
}

function getStoredItems(key) {
  if(!localStorage.getItem(key)) {
    return false;
  }
  else {
    return localStorage.getItem(key);
  }
}

function store(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

function updateTotal(arr) {
  var total = 0;

  for(var i=0; i<arr.length; i++) {
    total += arr[i].amount;
  }

  totalAmountEl.innerHTML = total.toLocaleString();
}

function updateList(arr) {
  itemsEl.innerHTML = '';
  var fragment = document.createDocumentFragment();
  var child;


  for(var i=arr.length - 1; i>=0; i--) {
    child = getChildTemplate(arr[i].item, arr[i].amount, i);
    fragment.appendChild(child);
  }

  itemsEl.appendChild(fragment);
}

function getChildTemplate(item, amount, index) {
  var div = document.createElement('div');
  div.classList.add('item');
  var editHTML = '<span class="ti-trash" data-index="'+index+'"></span><span class="ti-pencil" data-index="'+index+'"></span>';

  var firstP = createPara('item-title', item);
  var secondP = createPara('item-amount', amount);
  var thirdP = createPara('item-menu', editHTML);

  div.appendChild(firstP);
  div.appendChild(secondP);
  div.appendChild(thirdP);

  return div;
}

function createPara(cls, val) {
  var p = document.createElement('p');
  p.classList.add(cls);
  p.innerHTML = val;

  return p;
}

function clearForm() {
  formItem.value = '';
  formAmount.value = '';
}

function updateCount() {
  countEl.innerHTML = count++;
}