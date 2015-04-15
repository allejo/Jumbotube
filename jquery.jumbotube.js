// Copyright (c) 2010 Sean McCambridge | http://www.seanmccambridge.com/tubular
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

; (function ($, window) {

    // Default configuration options
    var defaults = {
        ratio: 16 / 9, // usually either 4/3 or 16/9 -- tweak as needed
        videoID: 'ZCAnLxRvNNc', // toy robot in space is a good default, no?
        mute: true,
        repeat: true,
        width: $(window).width(),
        wrapperZIndex: 99,
        playButtonClass: 'tubular-play',
        pauseButtonClass: 'tubular-pause',
        muteButtonClass: 'tubular-mute',
        volumeUpClass: 'tubular-volume-up',
        volumeDownClass: 'tubular-volume-down',
        volumeChangeFactor: 10,
        start: 0,
        end: -1,
        videoQuality: 'hd1080',
        relatedVideos: 0,
        onApiReady: function () {}
    };

    // methods

    var jumbotube = function (node, passedOptions) { // should be called on the wrapper div
        var options = $.extend({}, defaults, passedOptions),
            playTimer = null, // the timeout ID for auto-pausing
            $body = $('body'), // cache body node
            $node = $(node); // cache wrapper node

        // build container
        var jumbotubeContainer = '<div id="tubular-container" style="overflow: hidden; position: fixed; z-index: 1; width: 100%; height: 100%"><div id="tubular-player" style="position: absolute"></div></div><div id="tubular-shield" style="width: 100%; height: 100%; z-index: 2; position: absolute; left: 0; top: 0;"></div>';

        // set up css prereq's, inject tubular container and set up wrapper defaults
        $('html,body').css({ 'width': '100%', 'height': '100%' });
        $body.prepend(jumbotubeContainer);
        $node.css({ position: 'relative', 'z-index': options.wrapperZIndex });

        // set up iframe player, use global scope so YT api can talk
        window.JumboPlayer = null;
        window.onYouTubeIframeAPIReady = function () {
            JumboPlayer = new YT.Player('tubular-player', {
                width: options.width,
                height: Math.ceil(options.width / options.ratio),
                videoId: options.videoID,
                playerVars: {
                    controls: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    wmode: 'transparent',
                    vq: options.videoQuality,
                    rel: options.relatedVideos
                },
                events: {
                    'onReady': onJumboPlayerReady,
                    'onStateChange': onJumboPlayerStateChange
                }
            });

            options.onApiReady();
        };

        window.onJumboPlayerReady = function (e) {
            resize();

            if (options.mute) {
                e.target.mute();
            }

            e.target.seekTo(options.start);
            e.target.playVideo();
        };

        window.onJumboPlayerStateChange = function (state) {
            if (state.data === YT.PlayerState.ENDED && options.repeat) { // video ended and repeat option is set true
                JumboPlayer.seekTo(options.start); // restart
            }
            else if (state.data === YT.PlayerState.PLAYING && options.end > 0) {
                clearTimeout(playTimer);

                var time = JumboPlayer.getCurrentTime();

                if (time < options.end) {
                    var rate = JumboPlayer.getPlaybackRate();
                    var remainingTime = (options.end - time) / rate;

                    playTimer = setTimeout(function () {
                        if (options.repeat) {
                            JumboPlayer.seekTo(options.start);
                        }
                        else {
                            JumboPlayer.pauseVideo();
                        }
                    }, remainingTime * 1000);
                }
            }
        };

        // resize handler updates width, height and offset of player after resize/init
        var resize = function () {
            var width = $(window).width(),
                pWidth, // player width, to be defined
                height = $(window).height(),
                pHeight, // player height, tbd
                $tubularPlayer = $('#tubular-player');

            // when screen aspect ratio differs from video, video must center and underlay one dimension

            if (width / options.ratio < height) { // if new video height < window height (gap underneath)
                pWidth = Math.ceil(height * options.ratio); // get new player width
                $tubularPlayer.width(pWidth).height(height).css({ left: (width - pWidth) / 2, top: 0 }); // player width is greater, offset left; reset top
            } else { // new video width < window width (gap to right)
                pHeight = Math.ceil(width / options.ratio); // get new player height
                $tubularPlayer.width(width).height(pHeight).css({ left: 0, top: (height - pHeight) / 2 }); // player height is greater, offset top; reset left
            }
        };

        // events
        $(window).on('resize.jumbotube', function () {
            resize();
        });

        //
        // Watch and support button clicks
        //

        // Play button
        $('.' + options.playButtonClass).click(function (e) {
            e.preventDefault();
            JumboPlayer.playVideo();
        });

        // Pause button
        $('.' + options.pauseButtonClass).click(function (e) {
            e.preventDefault();
            JumboPlayer.pauseVideo();
        });

        // Sound button
        $('.' + options.muteButtonClass).click(function (e) {
            e.preventDefault();

            if (JumboPlayer.isMuted()) {
                JumboPlayer.unMute();
            }
            else {
                JumboPlayer.mute();
            }
        });

        // Volume down
        $('.' + options.volumeDownClass).click(function (e) {
            e.preventDefault();

            var currentVolume = JumboPlayer.getVolume();

            if (currentVolume < options.volumeChangeFactor) {
                currentVolume = options.volumeChangeFactor;
            }

            JumboPlayer.setVolume(currentVolume - options.volumeChangeFactor);
        });

        // Volume up
        $('.' + options.volumeUpClass).click(function (e) {
            e.preventDefault();

            // If the video is muted, then unmute it
            if (JumboPlayer.isMuted()) {
                JumboPlayer.unMute();
            }

            var currentVolume = JumboPlayer.getVolume();

            if (currentVolume > 100 - options.volumeChangeFactor) {
                currentVolume = 100 - options.volumeChangeFactor;
            }

            JumboPlayer.setVolume(currentVolume + options.volumeChangeFactor);
        });
    };

    // Load YouTube's JS API to interact with YouTube videos

    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Create the plugin

    $.fn.jumbotube = function (options) {
        return this.each(function () {
            if (!$.data(this, 'tubular_instantiated')) { // let's only run one
                $.data(this, 'tubular_instantiated',
                jumbotube(this, options));
            }
        });
    };

})(jQuery, window);