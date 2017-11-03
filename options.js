var background = chrome.extension.getBackgroundPage();


// Removes the selected condition
function remove_condition() {
  var conditions = document.getElementById('conditions');
  var value_string = conditions.options[conditions.selectedIndex].value;
  var value_items = value_string.split(" -> ");
  delete background.condition_values[value_items[0]];
  conditions.remove(conditions.selectedIndex);
}

// Adds a new condition
function add_condition() {
  var entered = document.getElementById('entered').value;
  var redirected = document.getElementById('redirected').value;
  var list = document.getElementById('conditions');
  list.options[list.options.length] = new Option(entered + ' -> ' + redirected, entered + ' -> ' + redirected);
  background.condition_values[entered] = redirected;
}

// Clears the textboxes
function clear_input() {
  var entered = document.getElementById('entered');
  var redirected = document.getElementById('redirected');
  entered.value = '';
  redirected.value = '';
}

// Saves options to chrome.storage
function save_options() {
  var conditions = document.getElementById('conditions');
  var condition_list = '';
  for (var i=0; i<conditions.length; i++){
    if (i!=0) condition_list += "{}"
    condition_list += conditions.options[i].value;
  }
  console.log(condition_list);
  chrome.storage.sync.set({
    redirectConditions: condition_list
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Conditions saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Resets the options page and clears all saved settings
function reset_options() {
  var conditions = document.getElementById('conditions');
  for (var i=conditions.options.length-1; i>=0; i--) {
    conditions.remove(i);
  }
  background.condition_values = {}
  document.getElementById('entered').value = '';
  document.getElementById('redirected').value = '';
  chrome.storage.sync.set({
    redirectConditions: ''
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Conditions reset.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Loads current settings stored in chrome.storage.
function load_options() {
  chrome.storage.sync.get({
    redirectConditions: ''
  }, function(storageItem) {
    if (storageItem.redirectConditions=='') return;
    var condition_list = storageItem.redirectConditions.split('{}');
    console.log(condition_list);
    var list = document.getElementById('conditions');
    for (var i=0; i<condition_list.length; i++) {
      var condition_items = condition_list[i].split(' -> ');
      list.options[list.options.length] = new Option(condition_items[0] + ' -> ' + condition_items[1], condition_items[0] + ' -> ' + condition_items[1]);
      background.condition_values[condition_items[0]] = condition_items[1];
    }
    console.log(background.condition_values);
  });
}


document.getElementById('remove').addEventListener('click', remove_condition);
document.getElementById('add').addEventListener('click', add_condition);
document.getElementById('clear').addEventListener('click', clear_input);
document.getElementById('save').addEventListener('click',save_options);
document.getElementById('reset').addEventListener('click',reset_options);
document.addEventListener('DOMContentLoaded', load_options);