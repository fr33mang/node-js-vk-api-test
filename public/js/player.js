var player = document.getElementById('audio');
var trackList = document.getElementsByClassName('track');
var activeTrack;

function setTrackActive(track){
	var targetTrackIcon = $(track).children('.track-icon-box').children('.track-icon');
	targetTrackIcon.removeClass('fa-music');
	targetTrackIcon.addClass('fa-volume-up');
	$(track).addClass('active');
}

function unsetTrackActive(track){
	var activeTrackIcon = $(track).children('.track-icon-box').children('.track-icon');
	activeTrackIcon.removeClass('fa-volume-up');
	activeTrackIcon.addClass('fa-music');
	$(track).removeClass('active');
}

window.onload = function() {
	player.volume=0.5;
	player.src = $(trackList[0]).attr("src");
	activeTrack = trackList[0];
	setTrackActive(trackList[0]);
	$('.player-box').children('.current-track').text($(activeTrack).children('.track-name').text());
}

player.next = function(){
	unsetTrackActive(activeTrack);

	if ($(activeTrack).next('.track').length > 0)
	{
		activeTrack = $(activeTrack).next('.track');
	}
	else{
		activeTrack = trackList[0];;
	}

	setTrackActive(activeTrack);

	player.src = $(activeTrack).attr("src");
	$('.player-box').children('.current-track').text($(activeTrack).children('.track-name').text());
	$('.play-icon').removeClass('fa-play');
	$('.play-icon').addClass('fa-pause');
	player.play();
}

player.prev = function(){
	unsetTrackActive(activeTrack);

	if ($(activeTrack).prev('.track').length > 0)
	{
		activeTrack = $(activeTrack).prev('.track');
	}
	else{
		activeTrack = trackList[trackList.length - 1];;
	}

	setTrackActive(activeTrack);

	player.src = $(activeTrack).attr("src");
	$('.player-box').children('.current-track').text($(activeTrack).children('.track-name').text());
	$('.play-icon').removeClass('fa-play');
	$('.play-icon').addClass('fa-pause');
	player.play();
}

player.onended = function(){
	player.next();
};

$('.play-button').click(function(event){
	if (player.paused){
		player.play();
		$('.play-icon').removeClass('fa-play');
		$('.play-icon').addClass('fa-pause');
	}
	else
	{
		player.pause();
		$('.play-icon').removeClass('fa-pause');
		$('.play-icon').addClass('fa-play');
	}
});

$('.volume-button').bind('DOMMouseScroll mousewheel', function(event){
	if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0){
		if (player.volume < 1)
			player.volume += 0.1;
	}
	else{
		if (player.volume > 0)
			player.volume -= 0.1;
	}
	player.volume = player.volume.toFixed(1);
	event.preventDefault();
});

$('.track').click(function(event){
	var target = event.target;
	while(target != musicList)
	{
		if (target.className.indexOf('track') >= 0)
		{
			unsetTrackActive(activeTrack);

			setTrackActive(target);

			player.src = $(target).attr("src");
			$('.player-box').children('.current-track').text($(target).children('.track-name').text());
			$('.play-icon').removeClass('fa-play');
			$('.play-icon').addClass('fa-pause');
			player.play();

			activeTrack = target;
		}

		target = target.parentNode;
	}
});

$(document).keydown(function(e) {
	var unicode = e.charCode ? e.charCode : e.keyCode;
             // right arrow
             if (unicode == 39) {
             	player.next();
          } else if (unicode == 37) {
          	player.prev();
          } else if (unicode == 32) {
          	$('.play-button').click();
          } else if (unicode == 38) {
          	player.volume += 0.1;
						player.volume = player.volume.toFixed(1);
          } else if (unicode == 40) {
          	player.volume -= 0.1;
						player.volume = player.volume.toFixed(1);
          }
        });