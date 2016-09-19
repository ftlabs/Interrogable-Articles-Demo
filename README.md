# Interrogable Articles Demo
A small web app demonstrating our idea that news articles are entities that can be interrogated for further information on the subject matter, or people/places therein.

## Live Version
A the lastest version of this demo is available on [Heroku](https://ftlabs-interrogable-articles.herokuapp.com/index.html).

## What does this app do?

This app doesn't have any clever logic behind it. It's basically a playlist of audio files with gaps in between that a user can use to ask pre-prescribed questions according to a script. 

## Using
After the web page has been loaded, the audio sources will load. After every audio file has finished loading (or rather, triggered the `canplay` event), a 'start' button will appear at the bottom of the screen. Tapping this button will start the scripted playback of audio with a pause of **3000ms** between each file for the interrogator to ask the scripted questions. 

At any point in the demo, the 'stop' button can be pushed, which will reset the demo and allow it to be started again. 

After all of the audio files have been played, the demo can be restarted by pushing the 'start' button again.

## Changing the audio files
The audio files for this demo are located in the `/audio` folder of this repo. If you wish to add/remove/completely change the audio files, you can drop your own in here. Then, in `/scripts/main.js`, locate the variable `audioSources`. This is an array of paths for audio files that will be loaded after the app has been accessed in a browser. The order of the files in the `audioSources` array is the order that the files will be played back in during the demo.

Once you've added and arranged the audio files as you like, commit the changes and redeply them to Heroku.

### Audio file formats

Depends on the browser that the web page is being run in. .m4a and .mp3 work well in Chrome.

## Hidden fine controls

To toggle the visibility of extra controls for the audio (play, pause, next, an previous) tap the header of the demo app. If the demo has not been started already, the controls will not show, but will once you tap the 'Start Demo' button. To indicate whether or not the buttons have been toggled, a red border will appear along the top of the header.

## Caveats/Gotchas

If you're running this demo in Chrome on a phone (Android), you need to change one one of Chrome's flags to enable the Javascript to play audio files without a user gesture. You can do this by going to **chrome://flags** on your device and disabling the '**Gesture requirement for media playback**' flag.