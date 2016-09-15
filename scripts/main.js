(function(){

	'use strict';

	var queryStep = 0;
	const steps = 3;

	const userInteractionZone = document.querySelector('#demoInteractions');
	const infoBox = userInteractionZone.querySelector('.info');
	const startDemoBtn = userInteractionZone.querySelector('#startDemoBtn');
	const stopDemoBtn = userInteractionZone.querySelector('#stopDemoBtn');

	const audioSources = {
		part1 : '/audio/part1.m4a',
		article : '/audio/part2.m4a',
		question1 : '/audio/part3.m4a'
	};

	infoBox.textContent = 'Loading Audio Sources';
	infoBox.dataset.visible = 'true';

	const loadedSources = Object.keys(audioSources).map( (key, idx) => {

		return new Promise( (resolve, reject) => {

			const audioEl = new Audio();
			audioEl.dataset.name = key;
			audioEl.dataset.step = idx;
			
			audioEl.oncanplay = function(){
				resolve(this);
			};

			audioEl.src = audioSources[key];
			audioEl.setAttribute('hidden', '');

			document.body.appendChild(audioEl);

		});

	});

	Promise.all(loadedSources)
		.then(sources => {
			console.log('All sources have loaded');
			infoBox.textContent = '';
			infoBox.dataset.visible = 'false';

			startDemoBtn.addEventListener('click', function(){

				this.dataset.visible = 'false';
				stopDemoBtn.dataset.visible = 'true';
				document.querySelector('audio[data-step="0"]').play();

				infoBox.textContent = 'Listening for input...';
				infoBox.dataset.visible = 'true';
				infoBox.dataset.blink = 'true';

			}, false);
			startDemoBtn.dataset.visible = 'true';

			stopDemoBtn.addEventListener('click', function(){

				this.dataset.visible = 'false';
				infoBox.dataset.blink = 'false';
				infoBox.dataset.visible = 'false';
				startDemoBtn.dataset.visible = 'true';
				queryStep = 0;

				document.querySelectorAll('audio').forEach(audio => {
					audio.pause();
					audio.currentTime = 0;
				})

			}, false);
			
		})
		.catch(err => {
			console.error('An error occurred loading the audio files');
			console.log(err);
		});
	;

}());