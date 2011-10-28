var commands = [
	['open', 'open <URL>'],
	['quit', 'quit']
];

chrome.omnibox.onInputChanged.addListener(function(text, suggest){
	var result = [];
	var matched_suggests = get_matched_suggests(text);
	result.push.apply(result, matched_suggests);
	if(matched_suggests.length == 1){
		chrome.omnibox.setDefaultSuggestion({
			description: matched_suggests[0]['description']
		});
		suggest([]);
	}else{
		chrome.omnibox.setDefaultSuggestion({
			description: 'Enter command'
		});
		suggest(result);
	}
});

chrome.omnibox.onInputStarted.addListener(function(){
	chrome.omnibox.setDefaultSuggestion({
		description: 'Enter command'
	});
});

chrome.omnibox.onInputCancelled.addListener(function(){
	chrome.omnibox.setDefaultSuggestion({
		description: 'Cancelled'
	});
});

chrome.omnibox.onInputEntered.addListener(function(text){
	alert(text);
});

function get_matched_suggests(text){
	var result = [];
	var text_parts = text.split(/\s+/);
	var first_part = text_parts[0];
	console.log("search for command: " + first_part);
	for(var i=0;i<commands.length;i++){
		var command_name = commands[i][0];
		var command_description = commands[i][1];
		if(command_name.indexOf(first_part) == 0){
			console.log("add result: " + command_name);
			result.push({
				content: command_name,
				description: render_description(command_description)
			});
		}
	}
	return result;
}

function render_description(desc){
	desc = desc.replace(new RegExp('<', 'g'), '&lt;');
	desc = desc.replace(new RegExp('>', 'g'), '&gt;');
	desc = '<match>' + desc + '</match>';
	return desc;
}

