/* eslint-disable no-console */
var form = document.querySelector('#app form');
var formItem = document.querySelector('#app #item');
var formAmount = document.querySelector('#app #amount');
var countEl = document.querySelector('#items-number');
var itemsEl = document.querySelector('#all-items');
var totalAmountEl = document.querySelector('#total');

var containerEl = document.querySelector('.container');

var confirmationEl = document.querySelector('#confirmation');
var deleteButton = document.querySelector('#confirm-delete');
var cancelDeleteButton = document.querySelector('#cancel-delete');
var itemConfirmationEl = document.querySelector('#item-confirmation');

var editEl = document.querySelector('#edit');
var editForm = document.querySelector('#edit form');
var editFormItem = document.querySelector('#edit form #edit-item');
var editFormAmount = document.querySelector('#edit form #edit-amount');
var editButton = document.querySelector('#confirm-edit');
var cancelEditButton = document.querySelector('#cancel-edit');

const KEY = 'budget';
var item, amount, currentSubmission;
var count = 0;
var ALL_ITEMS = [];

document.addEventListener('DOMContentLoaded', function () {
  if (getStoredItems(KEY)) {
    ALL_ITEMS = JSON.parse(getStoredItems(KEY));
    count = ALL_ITEMS.length;
    updateCount();
    updateList(ALL_ITEMS);
    updateTotal(ALL_ITEMS);
  }

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

  editForm.addEventListener('submit', editItems);

  cancelDeleteButton.addEventListener('click', hideDeleteConfirmation);

  deleteButton.addEventListener('click', deleteItem);

  cancelEditButton.addEventListener('click', hideEditBox);
});


// BUDGET CLASS
class Item {
  constructor(item, amount) {
    this.item = item;
    this.amount = amount;
  }
}

// FUNCTIONS
function editItems(e) {
  var index = editButton.dataset.index;

  ALL_ITEMS[index].item = editFormItem.value;
  ALL_ITEMS[index].amount = Number(editFormAmount.value);

  updateList(ALL_ITEMS);
  updateTotal(ALL_ITEMS);
  store(ALL_ITEMS);

  editFormItem.value = '';
  editFormAmount.value = '';
  editButton.dataset.index = null;

  hideEditBox();

  e.preventDefault();
}

function deleteItem(e) {
  var index = e.target.dataset.index;

  ALL_ITEMS.splice(index, 1);
  count = ALL_ITEMS.length;
  updateCount();
  updateList(ALL_ITEMS);
  updateTotal(ALL_ITEMS);

  itemConfirmationEl.innerHTML = 'Item';
  deleteButton.dataset.index = null;
  cancelDeleteButton.dataset.index = null;

  store(ALL_ITEMS);

  hideDeleteConfirmation();
}

function hideEditBox() {
  editEl.classList.remove('shown');
  containerEl.classList.remove('confirm');
}

function hideDeleteConfirmation() {
  confirmationEl.classList.remove('shown');
  containerEl.classList.remove('confirm');
}

function showDeleteConfirmation(e) {
  var index = e.target.dataset.index;
  var itemToDisplay = ALL_ITEMS[index].item + ' - ' + ALL_ITEMS[index].amount;
  itemConfirmationEl.innerHTML = itemToDisplay;

  confirmationEl.classList.add('shown');
  containerEl.classList.add('confirm');

  deleteButton.dataset.index = index;
  cancelDeleteButton.dataset.index = index;
}

function showEditBox(e) {
  var index = e.target.dataset.index;

  editEl.classList.add('shown');
  containerEl.classList.add('confirm');

  editButton.dataset.index = index;
  cancelEditButton.dataset.index = index;

  editFormItem.value = ALL_ITEMS[index].item;
  editFormAmount.value = ALL_ITEMS[index].amount;
}

function addDeleteListener() {
  var trashEl = document.querySelectorAll('.ti-trash');
  var editEl = document.querySelectorAll('.ti-pencil');

  for (var i = 0; i < trashEl.length; i++) {
    trashEl[i].addEventListener('click', showDeleteConfirmation);
    editEl[i].addEventListener('click', showEditBox);
  }
}

function getStoredItems(key) {
  if (!localStorage.getItem(key)) {
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
  if (arr.length === 0) {
    total = 'Budget';
  }
  else {
    for (var i = 0; i < arr.length; i++) {
      total += arr[i].amount;
    }
  }

  totalAmountEl.innerHTML = total.toLocaleString();
}

function updateList(arr) {
  itemsEl.innerHTML = '';
  var fragment = document.createDocumentFragment();
  var child;


  for (var i = arr.length - 1; i >= 0; i--) {
    child = getChildTemplate(arr[i].item, arr[i].amount, i);
    fragment.appendChild(child);
  }

  itemsEl.appendChild(fragment);

  addDeleteListener();
}

function getChildTemplate(item, amount, index) {
  var div = document.createElement('div');
  div.classList.add('item');
  var editHTML = '<span class="ti-trash" data-index="' + index + '"></span><span class="ti-pencil" data-index="' + index + '"></span>';

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

  formItem.focus();
  formAmount.blur();
}

function updateCount() {
  countEl.innerHTML = count++;
}