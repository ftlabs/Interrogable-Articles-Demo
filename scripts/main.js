(function(){

	'use strict';

	var audioIsUnderway = false;

	const userInteractionZone = document.querySelector('#demoInteractions');
	const infoBox = userInteractionZone.querySelector('.info');
	const startDemoBtn = userInteractionZone.querySelector('#startDemoBtn');
	const stopDemoBtn = userInteractionZone.querySelector('#stopDemoBtn');
	const fineControlsElement = userInteractionZone.querySelector('#fineGrainControls');
	const timeUntil = userInteractionZone.querySelector('#timeUntilChange');


	const fineControls = { 
		prev : fineControlsElement.querySelector('#previousBtn'),
		pause : fineControlsElement.querySelector('#pauseBtn'),
		resume : fineControlsElement.querySelector('#resumeBtn'),
		next : fineControlsElement.querySelector('#nextBtn')
	};

	var shouldShowFineControls = false;

	const audioSources = [
		'/audio/part1.m4a',
		'/audio/answer_1_a.mp3',
		'/audio/answer_1_b.mp3',
		'/audio/answer_1_c.mp3',
		'/audio/part2.m4a',
		'/audio/answer_2_a.mp3',
		'/audio/answer_2_b.mp3',
		'/audio/continuing.mp3',
		'/audio/part3.m4a',
	];

	var queryStep = 0;
	const steps = audioSources.length;
	var nextUp = undefined;
	var currentAudio = undefined;
	
	const breathe = 3000;
	
	document.querySelector('header').addEventListener('click', function(){

		if(!shouldShowFineControls){
			shouldShowFineControls = true;
			this.dataset.controlsindicator = "true";
			if(currentAudio !== undefined){
				if(!currentAudio.paused){
					fineControlsElement.dataset.visible = "true";
				}
			}
		} else {
			shouldShowFineControls = false;
			this.dataset.controlsindicator = "false";
			fineControlsElement.dataset.visible = "false";
		}

		console.log(shouldShowFineControls);

	}, false);

	infoBox.textContent = 'Loading Audio Sources';
	infoBox.dataset.visible = 'true';

	const loadedSources = audioSources.map( (source, idx) => {

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

			audioEl.onplay = function(){
				fineControls.pause.dataset.visible = "true";
				fineControls.resume.dataset.visible = "false";
			};

			audioEl.onended = function(){
				clearTimeout(nextUp);
				if(queryStep < steps - 1){
						
						audioIsUnderway = true;
						
						nextUp = setTimeout(function(){
							queryStep += 1;
							currentAudio = document.querySelector('audio[data-step="' + queryStep + '"]')
							currentAudio.play();

							if(queryStep > 0){
								fineControls.prev.dataset.opaque = "true";
							}

							if(queryStep >= steps - 1){
								fineControls.next.dataset.opaque = "false";
							}

						}, breathe);

				} else {

					audioIsUnderway = false;
					stopDemoBtn.dataset.visible = "false";
					startDemoBtn.dataset.visible = "true";
					fineControlsElement.dataset.visible = "false";

					infoBox.dataset.visible = 'true';
					infoBox.dataset.blink = 'true';
					infoBox.textContent = "";

					queryStep = 0;

				}
	
			};

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

				fineControls.prev.dataset.opaque = "false";
				fineControls.next.dataset.opaque = "true";

				stopDemoBtn.dataset.visible = 'true';
				currentAudio = document.querySelector('audio[data-step="0"]')
				currentAudio.play();

				infoBox.textContent = 'Listening for input...';
				infoBox.dataset.visible = 'true';
				infoBox.dataset.blink = 'true';

				if(shouldShowFineControls){
					fineControlsElement.dataset.visible = "true";
				}

			}, false);
			startDemoBtn.dataset.visible = 'true';

			stopDemoBtn.addEventListener('click', function(){

				this.dataset.visible = 'false';
				infoBox.dataset.blink = 'false';
				infoBox.dataset.visible = 'false';
				startDemoBtn.dataset.visible = 'true';
				queryStep = 0;

				fineControls.prev.dataset.opaque = "false";
				fineControls.next.dataset.opaque = "true";

				clearTimeout(nextUp);

				document.querySelectorAll('audio').forEach(audio => {
					audio.pause();
					audio.currentTime = 0;
				});

				fineControlsElement.dataset.visible = "false";

			}, false);

			fineControls.pause.addEventListener('click', function(){
				fineControls.pause.dataset.visible = "false";
				fineControls.resume.dataset.visible = "true";
				currentAudio.pause();
			}, false);

			fineControls.resume.addEventListener('click', function(){
				currentAudio.play();
				fineControls.resume.dataset.visible = "false";
				fineControls.pause.dataset.visible = "true";
			}, false);

			fineControls.prev.addEventListener('click', function(){

				fineControls.next.dataset.opaque = "true";

				if(queryStep > 0){

					currentAudio.pause()
					currentAudio.currentTime = 0;
					queryStep -= 1;
					currentAudio = document.querySelector('audio[data-step="' + queryStep + '"]')
					currentAudio.play();

					if(queryStep === 0){
						fineControls.prev.dataset.opaque = "false";
						
					} else {
						fineControls.prev.dataset.opaque = "true";						
					}

				} else {
					this.dataset.opaque = "false";
				}

			}, false);
			
			fineControls.next.addEventListener('click', function(){
				
				console.log(queryStep, steps - 1);

				if(queryStep + 1 === steps - 1){
					this.dataset.opaque = "false";
				}

				if(queryStep < steps - 1){
					currentAudio.pause()
					currentAudio.currentTime = 0;
					queryStep += 1;
					currentAudio = document.querySelector('audio[data-step="' + queryStep + '"]')
					currentAudio.play();

					fineControls.prev.dataset.opaque = "true";

				}

			}, false);

		})
		.catch(err => {
			console.error('An error occurred loading the audio files');
			console.log(err);
		});
	;

}());