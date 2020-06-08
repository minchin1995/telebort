$(document).ready(function() {
	var temp = document.querySelector('.time');
 	var button = document.querySelector("button");
 	var words = document.querySelector(".words");
 	var timerDiv = document.querySelector(".time");
 	var scoreDiv = document.querySelector(".score");
 	var points = 0;
 	var spans;
 	var typed;
 	var timerCount = 20;
	var backAudio = new Audio("audio/music.mp3");
	var correctAudio = new Audio("audio/correct.mp3");
	
	// timer function for the countdown
 	function countdown() {
 		points = 0;
		// function to start counting down the clock and in this case 20 seconds
 		var timer = setInterval(function(){
			// disable start button once countdown and the game starts
 			button.disabled = true;
    		timerCount--;
    		temp.innerHTML = timerCount;
			// when the timer hits 0 and the game is over background music is stopped and the score is displayed to users
			// the score and the timer then resets and start button is enabled again
    		if (timerCount === 0) {
				backAudio.pause();
    			alert("Game over! Your score is " + points);
    			scoreDiv.innerHTML = "0";
    			words.innerHTML = "";
    			button.disabled = false;
    			clearInterval(timer);
    			timerCount = 20;
    			timerDiv.innerHTML = "20";
    			button.disabled = false;
    		}
 		}, 1000);
  	}
	
	// start playing background music
	function startMusic() {
 		backAudio.currentTime = 0;
        backAudio.play();
  	}
	
	// random words are selected from a txt file
	function random()
	{
		// open textfile
		var rawFile = new XMLHttpRequest();
		var url = "textfile/text.txt";
		rawFile.open("GET", url, false);
		rawFile.onreadystatechange = function ()
		{
			if(rawFile.readyState === 4)
			{
				if(rawFile.status === 200 || rawFile.status == 0)
				{
					// words from file becomes an array
					var array = [];
					var allText = rawFile.responseText;
					arrayGet = allText.split(/\n|g/);
					
					// a random word is selected from the word file and splited by letter
					words.innerHTML = "";
					var random = Math.floor(Math.random() * (1943 - 0 + 1)) + 0;
					var wordArray = arrayGet[random].split("");
					
					for (var i = 0; i < wordArray.length; i++) { 
						var span = document.createElement("span");
						span.classList.add("span");
						span.innerHTML = wordArray[i];
						words.appendChild(span);
					}
					spans = document.querySelectorAll(".span");
					
				}
			}
		}
		rawFile.send(null);
	}

	// start timer, music and display a random word when start button is pressed
  	$("#startButton").click(function(e) {
  		countdown();
  		random();
  		startMusic();
  		button.disabled = true;
  	});
	

	// start checking if what user inputs matches with the words or letter displayed
  	function typing(e) {
		//get typed letter
		typed = String.fromCharCode(e.which);
		
		for (var i = 0; i < spans.length; i++) {
			// if letter inputed matched the one on display
			if (spans[i].innerHTML === typed) { 
				if (spans[i].classList.contains("bg")) { 
					continue;
				} else if (spans[i].classList.contains("bg") === false && spans[i-1] === undefined || spans[i-1].classList.contains("bg") !== false ) { // if it dont have class, if it is not first letter or if the letter before it dont have class (this is done to avoid marking the letters who are not in order for being checked, for example if you have two "A"s so to avoid marking both of them if the first one is at the index 0 and second at index 5 for example)
					// add background if letter is typed correctly
					spans[i].classList.add("bg");
					break;
				}
			}
			
		}
		
		// variable to calculate the number of letters typed correctly
		var checker = 0;
		
		for (var j = 0; j < spans.length; j++) { 
			
			// calculate the number of letters that are typed correctly
			if (spans[j].className === "span bg") {
				checker++;
			}
			
			// when the word is completed succesfully
			if (checker === spans.length) {
				// plays audio if word is succesfully typed
				correctAudio.pause();
				correctAudio.currentTime = 0;
				correctAudio.play();
				words.classList.add("animated");
				words.classList.add("fadeOut");
				// add score and display to user
				points++;
				scoreDiv.innerHTML = points; 
				document.removeEventListener("keydown", typing, false);
				
				// reset class and display a new word
				setTimeout(function(){
					words.className = "words";
					if (timerCount === 0) {
						// clear words when timer is 0
						words.innerHTML = "";
					} else { 
						random(); 
					}
					document.addEventListener("keydown", typing, false);
				}, 400);			
			}

		}
  	}
	
  	document.addEventListener("keydown", typing, false);
	
	
});