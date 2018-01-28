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
var pingSound = $('#hintSound');
var cam1 = $('#cam1'), cam2 = $('#cam2'), cam3 = $('#cam3'), cam4 = $('#cam4');
var focus1 = $('#focus1'), focus2 = $('#focus2'), focus3 = $('#focus3'), focus4 = $('#focus4');

var test = $('#test');

// Der aktuell aktive Chat in dem View
// 1: lokaler Chat
// 2: globaler Chat
var currentChat = 1

// Zeigt an, ob derzeit eine kamera focussiert wird (0 falls nicht)
var currentFocus = 0;

// Fensternamen aus der url auslesen
var windowName = document.location.hash.substr(1);

// Eventfunktion
var triggerEvent = window.opener.triggerEvent;

// Counter für ungelesene Nachrichten im anderen Tab
var unreadMessages = 0;

console.log(windowName);


// Grundfunktionen des fensters binden (nachdem die seite fertig geladen wurde)
$(function () {

	test.click(function () {
		cam1.animate({ height: '70%', width: '70%' });
		cam2.animate({ height: '30%', width: '30%' });
		cam3.animate({ height: '30%', width: '30%' });
		cam4.animate({ height: '30%', width: '30%' });
	});

    /*$('#lock').click(function () {
    });*/
	
	// Sende "ping" bei klick auf ein kamerabild
	$('.cam').click(function(e) {
		triggerEvent(
			windowName,
			'ping',
			{
				cam: $(e.target).attr('id'),
				x: (e.offsetX / e.target.offsetWidth),
				y: (e.offsetY / e.target.offsetHeight)
			});
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
	
	focus1.click(function (e) {
		e.stopPropagation();
		if(currentFocus == 1) {
			resetCameraFocus();
		}else{
			currentFocus = 1;
			cam1.animate({ height: '70%', width: '70%' });
			cam2.animate({ height: '30%', width: '30%' });
			cam3.animate({ height: '30%', width: '30%' });
			cam4.animate({ height: '30%', width: '30%' });
		}
	});
	
	focus2.click(function (e) {
		e.stopPropagation();
		if(currentFocus == 2) {
			resetCameraFocus();
		}else{
			currentFocus = 2;
			cam1.animate({ height: '30%', width: '30%' });
			cam2.animate({ height: '70%', width: '70%' });
			cam3.animate({ height: '30%', width: '30%' });
			cam4.animate({ height: '30%', width: '30%' });
		}
		
	});
	
	focus3.click(function (e) {
		e.stopPropagation();
		if(currentFocus == 3) {
			resetCameraFocus();
		}else{
			currentFocus = 3;
			cam1.animate({ height: '30%', width: '30%' });
			cam2.animate({ height: '30%', width: '30%' });
			cam3.animate({ height: '70%', width: '70%' });
			cam4.animate({ height: '30%', width: '30%' });
		}
	});
	
	focus4.click(function (e) {
		e.stopPropagation();
		if(currentFocus == 4) {
			resetCameraFocus();
		}else{
			currentFocus = 4;
			cam1.animate({ height: '30%', width: '30%' });
			cam2.animate({ height: '30%', width: '30%' });
			cam3.animate({ height: '30%', width: '30%' });
			cam4.animate({ height: '70%', width: '70%' });
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
			case 'ping':
				console.log(data);
				
				var img = $('<img src="ping.png">');
				var cam = $("#" + data.cam); 
				console.log((data.x * cam.get(0).offsetWidth));
				img.css({
					position: 'absolute',
					width: '40px',
					height: '40px',
					//left: ((data.x * cam.get(0).offsetWidth) - 20) + 'px',
					//top: ((data.y * cam.get(0).offsetHeight) - 20) + 'px'
					left: 'calc(' +(data.x * 100) + '% - 20px)',
					top: 'calc(' + (data.y * 100) + '% - 20px)'
				});
				
				cam.append(img);
				
				// Entferne Element nach 5 Sekunden
				setTimeout(function () {
					img.remove();
				}, 5000);
				
				if(windowName == "view1")
					pingSound.get(0).play();
				
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
	
	function resetCameraFocus () {
		cam1.animate({ height: '50%', width: '50%' });
		cam2.animate({ height: '50%', width: '50%' });
		cam3.animate({ height: '50%', width: '50%' });
		cam4.animate({ height: '50%', width: '50%' });
		currentFocus = 0;
	}



});