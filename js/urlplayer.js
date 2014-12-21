var player;
var currentUrl = '';
var playlist = [];
var listenerAdded = 0;

$(function() {
  player = new CastPlayer();
  var url = getUrlParameter("url")
  if (url) {
    $('#url').val(url);
  }
});

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++)  {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return decodeURIComponent(sParameterName[1]);
    }
  }
}


function launchApp() {
  player.launchApp();
}

function getContentType(url) {
  var ext = url.split('.').pop();
  var formats = [
    {ext: 'mkv', type: 'video'},
    {ext: 'webm', type: 'video'},
    {ext: 'mp4', type: 'video'},
    {ext: 'm4v', type: 'video'},
    {ext: 'm4a', type: 'audio'},
    {ext: 'jpeg', type: 'image'},
    {ext: 'jpg', type: 'image'},
    {ext: 'gif', type: 'image'},
    {ext: 'png', type: 'image'},
    {ext: 'bmp', type: 'image'},
    {ext: 'webp', type: 'image'}
  ];
  for (var i = 0; i < formats.length; i++) {
    if (formats[i].ext == ext) {
      return formats[i].type + "/" + ext;
    }
  }
  // it doesn't matter now, as it's unsupported.
  return "";
}

function findVideoUrl(url)
{
  if (url.indexOf("vodlocker.com")!=-1)
  {
    $.getJSON('http://whateverorigin.org/get?url=' + 
      encodeURIComponent(url) + '&callback=?',
      function(data) 
      {
        var vodreg = /file\: \"(.*)\"/g;
        var match = vodreg.exec(data.contents);
        playlistAdd(match[1]);
      });
  }
  else 
  {
    playlistAdd(url);
  }  
}

function startPlayback() {
  if (player.session == null || $('#url').val().trim() == "") {
    return;
  }
  var url = decodeURIComponent($('#url').val());
  var contentType = getContentType(url);
  player.loadMedia(url, contentType);
  $('#player_now_playing').html(url.split(/[\\/]/).pop());
  $('#controls').show();

  if (!listenerAdded)
  {
    listenerAdded=1;
    player.session.addUpdateListener(function(e) 
    {
      if (playlist.length>0)
      {
        next();      
      } 
    });
  }
}

function addToPlaylist()
{
  findVideoUrl($("#playlisturl").val());
  $("#playlisturl").val("");
}

function playlistAdd(url)
{
  playlist.push(url);
}

function next()
{
  var url=playlist.shift();
  var contentType = getContentType(url);
  player.loadMedia(url, contentType);
}

function pause() {
  if (player.session != null) {
    player.pauseMedia();
  }
}

function resume() {
  if (player.session != null) {
    player.playMedia();
  }
}

function seek(is_forward) {
  if (player.session != null) {
    player.seekMedia(parseInt($("#player_seek").val()), is_forward);
  }
}

function seekTo() {	
  if (player.session != null) {
    player.seekTo(parseInt($("#player_seek_range").val()));
  }
}

function stop() {
  var reply = confirm("This will stop playback on the TV. Are you sure?");
  if (reply == true) {
    player.stopApp();
    $('#controls').hide();
  }
}

function volumeDown() {
  if (player.session != null) {
      player.volumeControl(false, false);
  }
}

function volumeUp() {
  if (player.session != null) {
    player.volumeControl(true, false);
  }
}

function volumeMute() {
  if (player.session != null) {
    player.volumeControl(false, true);
  }
}
