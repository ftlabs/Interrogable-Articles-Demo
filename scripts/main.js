(function(){

	'use strict';

	const userInteractionZone = document.querySelector('#demoInteractions');
	const infoBox = userInteractionZone.querySelector('.info');
	const startDemoBtn = userInteractionZone.querySelector('#startDemoBtn');
	const stopDemoBtn = userInteractionZone.querySelector('#stopDemoBtn');
	const timeUntil = userInteractionZone.querySelector('#timeUntilChange');

	const audioSources = [
		'/audio/part1.m4a',
		'/audio/answer_1_a.m4a',
		'/audio/answer_1_b.m4a',
		'/audio/answer_1_c.m4a',
		'/audio/part2.m4a',
		'/audio/answer_2_a.m4a',
		'/audio/answer_2_b.m4a',
		'/audio/continuing.m4a',
		'/audio/part3.m4a',
	];

	var queryStep = 0;
	const steps = audioSources.length;
	var nextUp = undefined;

	const breathe = 3000;
	
	infoBox.textContent = 'Loading Audio Sources';
	infoBox.dataset.visible = 'true';

	const loadedSources = audioSources.map( (source, idx) => {

		console.log(source);

		return new Promise( (resolve, reject) => {

			const audioEl = new Audio();
			audioEl.dataset.name = source;
			audioEl.dataset.step = idx;

			audioEl.oncanplay = function(){
				resolve(this);
			};

			audioEl.ontimeupdate = function(){

				var timeLeft = this.duration - this.currentTime | 0;

				if(timeLeft <= 3){
					timeUntil.dataset.opaque = "true";
					timeUntil.textContent = timeLeft;
				} else if(timeUntil.dataset.opaque !== "false"){
					timeUntil.dataset.opaque = "false";					
				}

			}

			audioEl.onended = function(){
				clearTimeout(nextUp);
				nextUp = setTimeout(function(){

					if(queryStep < steps){
						queryStep += 1;
						document.querySelector('audio[data-step="' + queryStep + '"]').play();
					}
	
				}, breathe);
			}

			audioEl.src = source;
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
				clearTimeout(nextUp);

				document.querySelectorAll('audio').forEach(audio => {
					audio.pause();
					audio.currentTime = 0;
				});

			}, false);
			
		})
		.catch(err => {
			console.error('An error occurred loading the audio files');
			console.log(err);
		});
	;

}());