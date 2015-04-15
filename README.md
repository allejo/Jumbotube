# jQuery Jumbotube

jQuery Jumbotube is a fork of the [tubular](https://github.com/mccambridge/tubular) jQuery plug-in that allows you to use YouTube videos as backgrounds.

## Requirements

- jQuery 1.8.0+

## Usage

1. Load jQuery on your web page if you haven't already. Preferably use jQuery from a CDN such as [Google's Hosted Libraries](https://developers.google.com/speed/libraries/) or [jQuery's CDN](https://code.jquery.com/).
2. After jQuery has been loaded, load the `jquery.jumbotube.js` plug-in
3. Use the Jumbotube

  ```
  $('#tubular').jumbotube({
     videoId: 'I_QsCXm1vrk'
  });
  ```

### Configuration Options

- ratio
	- Default: 16 / 9
	- Description: The ratio for the video size. Typically 16/9 or 4/3
- videoId
	- Default: 'ZCAnLxRvNNc'
	- Description: The ID of the YouTube video
- mute
	- Default: true
	- Description: Whether or not to have the video be muted
- repeat
	- Default: true
	- Description: Whether or not to repeat the video when it ends
- width
	- Default: $(window).width()
	- Description: The width that the video will take up
- wrapperZIndex
	- Default: 99
	- Description: The z-index the Jumbotube video will take
- playButtonClass
	- Default: 'tubular-play'
	- Description: The class that will be listened for in order to play a Jumbotube video
- pauseButtonClass
	- Default: 'tubular-pause'
	- Description: The class that will be listened for in order to pause a Jumbotube video
- muteButtonClass
	- Default: 'tubular-mute'
	- Description: The class that will be listened for in order to mute a Jumbotube video
- volumeUpClass
	- Default: 'tubular-volume-up'
	- Description: The class that will be listened for in order to raise the volume of a Jumbotube video
- volumeDownClass
	- Default: 'tubular-volume-down'
	- Description: The class that will be listened for in order to lower the volume of a Jumbotube video
- volumeChangeFactor
	- Default: 10
	- Description: The amount the volume will be increased/decreased by when `tubular-volume-up` or `tubular-volume-down` are clicked, respectively
- start
	- Default: 0
	- Description: The time, in seconds, the video should start at
- videoQuality
	- Default: 'hd1080'
	- Description: The default video quality for the video
- relatedVideos
	- Default: 0
	- Description: Display related videos when the video is finished playing
- onApiReady
	- Default: function () {}
	- Description: A function that will be called inside of onYouTubeIframeAPIReady(). Because this plug-in automatically loads the YouTube JS API, it'll cause conflicts with trying to override onYouTubeIframeAPIReady() for your own YouTube videos.