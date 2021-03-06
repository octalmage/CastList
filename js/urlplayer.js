var player;
var currentUrl = '';
var playlist = [];
var listenerAdded = 0;

$(function()
{
	player = new CastPlayer();
	var url = getUrlParameter("url")
	if (url)
	{
		$('#url').val(url);
	}

	//Keyboard controls.
	$(document).keydown(function(event)
	{
		//Do nothing if player isn't connected.
		if (player.session == null) return;

		switch (event.which)
		{
			case 32: //Space bar.
				if (player.castPlayerState == "PLAYING") pause(); //Pause if playing.
				else if (player.castPlayerState == "PAUSED") resume(); //Play if paused.
				break;
			case 37: //Left arrow.
				seek(false); //Rewind.
				break;
			case 38: //Up arrow.
				volumeUp(); //Volume up.
				break;
			case 39: //Right arrow.
				seek(true); //Fast forward.
				break;
			case 40: //Down arrow.
				volumeDown(); //Volume down.
				break;
		}
	});
});

function getUrlParameter(sParam)
{
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++)
	{
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam)
		{
			return decodeURIComponent(sParameterName[1]);
		}
	}
}

function launchApp()
{
	player.launchApp();
}

function getContentType(url)
{
	var ext = url.split('.').pop();
	var formats = [
	{
		ext: 'mkv',
		type: 'video'
	},
	{
		ext: 'webm',
		type: 'video'
	},
	{
		ext: 'mp4',
		type: 'video'
	},
	{
		ext: 'm4v',
		type: 'video'
	},
	{
		ext: 'm4a',
		type: 'audio'
	},
	{
		ext: 'jpeg',
		type: 'image'
	},
	{
		ext: 'jpg',
		type: 'image'
	},
	{
		ext: 'gif',
		type: 'image'
	},
	{
		ext: 'png',
		type: 'image'
	},
	{
		ext: 'bmp',
		type: 'image'
	},
	{
		ext: 'webp',
		type: 'image'
	}];
	for (var i = 0; i < formats.length; i++)
	{
		if (formats[i].ext == ext)
		{
			return formats[i].type + "/" + ext;
		}
	}
	// it doesn't matter now, as it's unsupported.
	return "";
}

function startPlayback()
{
	if (player.session == null || $('#url').val().trim() == "")
	{
		return;
	}
	var url = decodeURIComponent($('#url').val());
	play(url);
	$('#player_now_playing').html(url.split(/[\\/]/).pop());
	$('#controls').show();

	if (!listenerAdded)
	{
		listenerAdded = 1;
		player.session.addUpdateListener(function(e)
		{
			if (playlist.length > 0 && player.session.media.length < 1)
			{
				next();
			}
		});
	}
}

function addToPlaylist()
{
	playlistAdd($("#playlisturl").val());
	$("#playlisturl").val("");
}

function playlistAdd(url)
{
	playlist.push(url);
}

function next()
{
	play(playlist.shift());
}

function play(url)
{
	var contentType = getContentType(url);
	player.loadMedia(url, contentType);
}

function pause()
{
	if (player.session != null)
	{
		player.pauseMedia();
	}
}

function resume()
{
	if (player.session != null)
	{
		player.playMedia();
	}
}

function seek(is_forward)
{
	if (player.session != null)
	{
		player.seekMedia(parseInt($("#player_seek").val()), is_forward);
	}
}

function seekTo()
{
	if (player.session != null)
	{
		player.seekTo(parseInt($("#player_seek_range").val()));
	}
}

function stop()
{
	var reply = confirm("This will stop playback on the TV. Are you sure?");
	if (reply == true)
	{
		player.stopApp();
		$('#controls').hide();
	}
}

function volumeDown()
{
	if (player.session != null)
	{
		player.volumeControl(false, false);
	}
}

function volumeUp()
{
	if (player.session != null)
	{
		player.volumeControl(true, false);
	}
}

function volumeMute()
{
	if (player.session != null)
	{
		player.volumeControl(false, true);
	}
}
