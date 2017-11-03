var condition_values = {};


function getNewURL (details) {
    var enteredUrl = details.url;
    var newUrl = enteredUrl;

    var condition_key;
    for (condition_key in condition_values) {
        // var parts = condition_key.split('*');
        // var pattern = parts.join('[\\S]*');
        // pattern = '^' + pattern + '$';
        // var match = enteredUrl.match(pattern);
        var replace_part = condition_key;
        if (condition_key[condition_key.length-1]=='*') {
            replace_part = condition_key.replace('*','');
            var pattern = '^' + replace_part + '[\\S]*$';
            var match = enteredUrl.match(pattern);
            if(match==null) continue;
        }
        else {
            var second_test = enteredUrl;
            if (enteredUrl[enteredUrl.length-1]=='/')
                second_test = enteredUrl.substring(0, enteredUrl.length-1);
            if (enteredUrl!=condition_key && second_test!=condition_key)
                continue;
        }
        newUrl = enteredUrl.replace(replace_part, condition_values[condition_key]);
        break;
    }
    return {redirectUrl: newUrl};
}

chrome.storage.sync.get(
    {redirectConditions: ''}, 
    function(storageItem) {
        if (storageItem.redirectConditions=='') return;
        var condition_list = storageItem.redirectConditions.split('{}');
        console.log(condition_list);
        for (var i=0; i<condition_list.length; i++) {
          var condition_items = condition_list[i].split(' -> ');
          condition_values[condition_items[0]] = condition_items[1];
        }
        console.log(condition_values);
        chrome.webRequest.onBeforeRequest.addListener(
            function(details) {
                return getNewURL(details);
            },
            {urls: ["<all_urls>"]},
            ["blocking"]
        );
    }
);
