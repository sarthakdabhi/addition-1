(function() {
	function Game() {
		this.questions = [
			{
				q: "How many pokemons are here?",
				items: ['pikachu', 'squirtle']
			},
			{
				q: "How many angry birds are here?",
				items: ['angry1', 'angry2']
			},
			{
				q: "How many cats are here?",
				items: ['cat1', 'cat2']
			}
		];
		this.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		this.number1 = 0;
		this.number2 = 0;
		this.answer = 0;
		this.attempts = 0;
		this.learningAttempts = 0;

		this.init();
	}

	Game.prototype.init = function() {
		this.loadScreen(0);
	}

	Game.prototype.loadScreen = function(screenNumber) {
		$('.screens').hide();
		$('#screen-' + screenNumber).show();

		switch(screenNumber) {
			case 0:
				this.screen0();
				break;
			case 1:
				this.screen1();
				break;
			case 2:
				this.screen2();
				break;
			default:
				this.loadScreen(0);
				break;
		}
	}

	Game.prototype.screen0 = function() {
		var that = this;
		$('#learn').one('click', function(e) {
			that.loadScreen(1);
		});
		$('#practice').one('click', function(e) {
			that.loadScreen(2);
		});
	}

	Game.prototype.screen2 = function() {
		var that = this;
		this.number1 = ramdomArray(this.numbers);
		this.number2 = ramdomArray(this.numbers);
		this.answer = this.number1 + this.number2;
		this.learningAttempts = 0;
		$('#results').html('');
		$('#practice_your_ans').val('');
		$('#practice_ques').html(this.number1 + " + " + this.number2 + " = ");
		$('#practice_your_ans').removeClass('right');
		$('#practice_your_ans').removeClass('wrong');
		$('#practice_your_ans').prop("disabled", false);

		$('#practice_your_ans').on('keypress keyup blur', function(e) {
			$(this).val($(this).val().replace(/[^\d].+/, ""));
			if ((e.which < 48 || e.which > 57)) {
			    e.preventDefault();
			}
			if(e.keyCode == 13 || e.which == 13) {
				$('#practice_your_ans').off('keypress');
				$(this).prop("disabled", true);

				if(this.value == that.answer) {
					$(this).addClass('right');
					setTimeout(function() {
						that.loadScreen(2);
					}, 1000);
				} else {
					$(this).addClass('wrong');

					if(that.attempts > 2) {
						$('#results').html('Your answer is wrong. Your 3 attempts are over. Let\'s learn!');
						setTimeout(function() {
							that.loadScreen(1);
						}, 1000);					
					} else {
						$('#results').html('Your answer is wrong. Let\'s try another!');
						setTimeout(function() {
							that.loadScreen(2);
						}, 1000);					
						that.attempts++;
					}
				}
			}
		});
	}

	Game.prototype.screen1 = function() {
		var that = this;
		this.number1 = ramdomArray(this.numbers);
		this.number2 = ramdomArray(this.numbers);
		this.answer = this.number1 + this.number2;
		this.attempts = 0;
		var ques = ramdomArray(this.questions);
		$('#toy-1').html('');
		$('#toy-2').html('');
		$('#learning_ques').html(ques.q);
		$('#your_ans').removeClass('right');
		$('#your_ans').removeClass('wrong');
		$('#your_ans').prop("disabled", false);
		$('#your_ans').val('');
		$('#explain').html('');
		
		$('#que').html(this.number1 + " + " + this.number2 + " = ");
		
		for(var i = 0; i < this.number1; i++) {
			$('#toy-1').append("<img src='./images/" + ques.items[0] + "-toy.png' class='toys'>");
		}
		
		for(var i = 0; i < this.number2; i++) {
			$('#toy-2').append("<img src='./images/" + ques.items[1] + "-toy.png' class='toys'>");
		}

		$('#your_ans').on('keypress keyup blur', function(e) {
			$(this).val($(this).val().replace(/[^\d].+/, ""));
			if ((e.which < 48 || e.which > 57)) {
			    e.preventDefault();
			}		
			if(e.keyCode == 13 || e.which == 13) {
				$('#your_ans').off('keypress');
				$(this).prop("disabled", true);
				if (parseInt(this.value) == that.answer) {
					$(this).addClass('right');
					that.learningAttempts++;
					if(that.learningAttempts > 2) {
						setTimeout(function() {
							that.loadScreen(2);
						}, 1000);
					} else {
						setTimeout(function() {
							that.loadScreen(1);
						}, 1000);
					}
				} else {
					$(this).addClass('wrong');

					$('#explain').html('Your answer is wrong. You have to count all the toys. Let\'s start counting!');

					var tempNum1 = that.number1;
					var tempNum2 = that.number1 + 1;
					var wrongInterval1 = setInterval(function() {
						if(tempNum1 == 0) {
							clearInterval(wrongInterval1);

							var index = 0;
							var wrongInterval2 = setInterval(function() {
								if(that.answer + 1 == tempNum2) {
									clearInterval(wrongInterval2);

									setTimeout(function() {
										that.loadScreen(1);
									}, 1000);

								} else {
									var msg = new SpeechSynthesisUtterance(tempNum2.toString());
									window.speechSynthesis.speak(msg);
									$('#toy-2').children().eq(index).css('opacity', .5);
									tempNum2++;
									index++;
								}
							}, 1000);

						} else {
							var msg = new SpeechSynthesisUtterance((that.number1 - tempNum1 + 1).toString());
							window.speechSynthesis.speak(msg);
							$('#toy-1').children().eq(that.number1 - tempNum1).css('opacity', .5);
							tempNum1--;
						}
					}, 1000);

				}
			}
		});

	}

	function ramdomArray(arr) {
		return arr[Math.floor(Math.random()*arr.length)];
	}

	window.onload = function() {
		new Game;
	}
})();