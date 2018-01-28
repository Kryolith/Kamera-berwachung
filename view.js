// Der aktuelle synchronisierte Zustand des Views
var state = {
	globalChat: [],
	localChat: [],
	cameraSwapTime: 300,
	cameraLocked: false
};

// HTML Elemente
var localChat = $('#localchat');
var globalChat = $('#globalchat');
var chat = $('#chat');
var chatInput = $('#chatInput');
var chatSubmit = $('#chatSubmit');
var swapTimer = $('#swapTimer');
var unreadLocal = $('#unreadLocal');
var unreadGlobal = $('#unreadGlobal');
var chatSound = $('#chatSound');

// Der aktuell aktive Chat in dem View
// 1: lokaler Chat
// 2: globaler Chat
var currentChat = 1

// Fensternamen aus der url auslesen
var windowName = document.location.hash.substr(1);

// Eventfunktion
var triggerEvent = window.opener.triggerEvent;

// Counter für ungelesene Nachrichten im anderen Tab
var unreadMessages = 0;

console.log(windowName);


// Grundfunktionen des fensters binden (nachdem die seite fertig geladen wurde)
$(function () {

	//
    $('#lock').click(function () {

    });

	// Ändere Chat zu lokal
    localChat.click(function () {
		if(currentChat == 2) {
			localChat.addClass('active');
			globalChat.removeClass('active');
			unreadLocal.hide();
			unreadMessages = 0;
			clearChat();
			state.localChat.forEach(addMessageToChat);
			currentChat = 1;
		}
    });

	// Ändere Chat zu global
    globalChat.click(function () {
		if(currentChat == 1) {
			globalChat.addClass('active');
			localChat.removeClass('active');
			unreadGlobal.hide();
			unreadMessages = 0;
			clearChat();
			state.globalChat.forEach(addMessageToChat);
			currentChat = 2;
		}
    });

	// Sende Nachricht aus Chatinput
	chatSubmit.click(function () {
		if(chatInput.val() != '') {
			//addMessageToChat({ sender: 'dieser', content: chatInput.val()});
			triggerEvent(windowName, 'message', { 
				sender: windowName,
				content: chatInput.val(),
				type: currentChat
			});
			chatInput.val('');
		}
	});
	
	// Callbackfunction des Main windows auf dieses Fenster binden
    window.opener.registerCallback(windowName, function (type, data) {
		
		switch(type) {
			// Neue Nachricht (global und lokal)
			case 'message':
				// lokale Nachricht
				if(data.type == 1)
					state.localChat.push(data);
				else	
					state.globalChat.push(data);
				if(currentChat == data.type)
					addMessageToChat(data);
				else{
					// Zeige neue Nachricht badge an
					unreadMessages++;
					
					if(currentChat == 1) {
						unreadGlobal.html(unreadMessages + " neu");
						
						if(unreadMessages == 1)
							unreadGlobal.show();
					}else{
						unreadLocal.html(unreadMessages + " neu");
						
						if(unreadMessages == 1)
							unreadLocal.show();
					}
						
				}
				
				// Spiele chat sound nur auf einem view ab
				// Hört man sonst doppelt
				if(windowName == "view1")
					chatSound.get(0).play();
				
				break;
		}
    });
	
	setInterval(updateCameraSwapTime, 1000);
	
	// Fügt eine Nachricht dem Chatfenster hinzu und scrollt runter
	function addMessageToChat (message) {
		chat.find('p').append('<strong>' + message.sender + '</strong>: ' + message.content + '<br>');
		chat.scrollTop(chat[0].scrollHeight - chat[0].clientHeight);
	}
	
	// Chatfenster leeren
	function clearChat () {
		chat.find('p').html('');
	}
	
	// Aktualisiere Kamerawechselanzeige
	function updateCameraSwapTime() {
		var min = Math.floor(state.cameraSwapTime / 60);
		var sec = state.cameraSwapTime % 60;
		
		if(sec < 10)
			sec = '0' + sec;
		
		if(state.cameraLocked)
			swapTimer.html('LOCKED');
		else
			swapTimer.html(min + ':' + sec);
		if(state.cameraSwapTime > 0) state.cameraSwapTime--;
	}



});