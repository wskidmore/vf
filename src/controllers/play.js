(function(Play,document,undefined){
    Play.id = 'play';
    Play.isCreated = false;

    Play.currentWord = null;
    Play.currentAnswer = null;
    Play.badAnswers = [];
    Play.currentWordIndex = 0;
    Play.time = 0;


    Play.create = function(){
        Play.isCreated = true;

        if(Play.currentWord !== null){
            Play.updateHtml();
        }

        $('#play-submit').click(Play.selectAnswer);
        $('#play-next').click(Play.next);
        $('#play-skip').click(Play.skip);
        $('#play-next').hide();
        $('#play-message').hide();
        if(VF.data.gameType.indexOf('Time')==-1){
            $('#play-time-nav').hide();
        }

        Play.updateCorrectScore(0);
        Play.updateWrongScore(0);
    };
    Play.skip = function(){
        Play.selectAnswer(true);
    };
    Play.init = function(){
        $('#play-footer-nav').removeClass('ui-grid-c').addClass('ui-grid-a');
    };
    Play.selectAnswer = function(isSkip){
        var selectedElement = $('input[name="play-answer"]:checked', '#play');
        if(selectedElement.length === 0 && !isSkip) return;
        Play.endTimer();
        $('#play-skip').hide();
        $('#play-message').show();
        $('#play-submit').hide();
        $('#play-next').show();
        var isCorrect = (isSkip === true) ? '-1' : selectedElement.val();
        switch(isCorrect){
            case '0':
                selectedElement.next('label').addClass('ui-btn-up-g');
                Play.answerIsCorrect();
            break;
            case '1':
                selectedElement.next('label').addClass('ui-btn-up-r');
                Play.answerIsWrong();
            break;
            case '-1':
                Play.answerIsSkipped();
            break;
        }
        VF.save();
    };
    Play.showMessage = function(message){
        if($.isArray(message))
            message = VF.utils.randomArrayEl(message);
        $('#play-message').find('span.ui-btn-text').first().html(message);
    };
    Play.answerIsSkipped = function(){
        console.log('skipping');
        $('input[name="play-answer"][value="0"]', '#play').next('label').addClass('ui-btn-up-g');
        VF.data.correctStreak = 0;
        Play.updateWrongScore(0);
        Play.showMessage(VF.messages.wrong);
    };
    
    Play.answerIsCorrect = function(){
        Play.updateCorrectScore(1);
        VF.data.correctStreak += 1;
        VF.data.answersTally._correct +=1;
        VF.utils.playSound(VF.sounds.correct);
        Play.showMessage(VF.messages.correct);
        Play.addCurrentToFinished();
    };

    Play.addCurrentToFinished = function(){
        VF.data.finished[VF.data.currentDict].push(Play.currentWordIndex);
    };

    Play.answerIsWrong = function(){
        $('input[name="play-answer"][value="0"]', '#play').next('label').addClass('ui-btn-up-g');
        Play.updateWrongScore(1);
        VF.data.correctStreak = 0;
        VF.data.answersTally._wrong +=1;
        VF.utils.playSound(VF.sounds.wrong);
        Play.showMessage(VF.messages.wrong);
    };

    Play.updateCorrectScore = function(points){
        var tally = VF.data.answersTally[VF.data.currentDict];
        if(tally){
            VF.data.answersTally[VF.data.currentDict].correct += points;
        } else {
            VF.data.answersTally[VF.data.currentDict] = {
                correct: points,
                wrong: 0,
                total: VF.data.currentDictLength
            };
        }
        $('#correct').html(VF.data.answersTally[VF.data.currentDict].correct);
    };
    Play.updateWrongScore = function(points){
        var tally = VF.data.answersTally[VF.data.currentDict];
        if(tally){
            VF.data.answersTally[VF.data.currentDict].wrong += points;
        } else {
            VF.data.answersTally[VF.data.currentDict] = {
                correct: 0,
                wrong: points,
                total: Play.currentDictLength
            };
        }
        $('#wrong').html(VF.data.answersTally[VF.data.currentDict].wrong);
    };
    Play.insertText = function(node, content){
        node.css({opacity:0});
        node.text(content);
        node.animate({opacity:1}, 800);
    };

    Play.updateHtml = function(){
        Play.cleanCSS();
        Play.insertText($('#playTitle'), Play.currentWord);
        var answerIds = [0,1,2,3],
            correctId = VF.utils.getRandomInt(0,4),
            i=3;
        answerIds.splice(correctId,1);

        Play.updateChoice(correctId,0,Play.currentAnswer);

        while(i--){
            Play.updateChoice(answerIds[i],1,Play.badAnswers[i]);
        }
    };
    Play.updateChoice = function(id,val,def){
        var el = $('#play-answer'+id);
        var node = null;
        if(el.next('label').children().length > 0){
            node = el.val(val).next('label').children().eq(0).children().eq(0);
            Play.insertText(node, def);
        } else {
            node = el.val(val).next('label');
            node.text(def);
        }
    };

    Play.cleanCSS = function(){
        $('input[name="play-answer"]', '#play').each(function(){
            $(this).next('label').removeClass('ui-btn-up-g ui-btn-up-r');
        });
    };
    Play.startTimer = function(){
        $('#play-time-nav').show();
        var now = new Date();
        var toAdd = (parseFloat(VF.timers[VF.data.gameType],10)*1000);
        var total = now.getTime() + toAdd;
        Play.time = new Date(total);
        Play.timer = setTimeout(Play.updateTimer,1000);
    };
    Play.updateTimer = function(){
        var now = new Date();
        var ms = Play.time.getTime() - now.getTime();
        console.log(now.getTime(), Play.time.getTime(), ms);
        var seconds = Math.floor(ms/1000),
            minutes = 0;

        while(seconds>=60){
            minutes += 1;
            seconds -= 60;
        }
        $('#time span.ui-btn-text').text( VF.utils.padTo(minutes,2)+':'+VF.utils.padTo(seconds,2));


        if(seconds === 0) {
            $('#play-skip').hide();
            $('#play-message').show();
            $('#play-submit').hide();
            $('#play-next').show();
            Play.answerIsWrong();
            VF.save();
        } else {
            Play.timer = setTimeout(Play.updateTimer, 500);
        }
    };
    Play.endTimer = function(){
        clearTimeout(Play.timer);
    };
    Play.next = function(){
        var type = 'next'+VF.data.gameType.replace('Timed','');
        $('#play-time-nav').hide();
        Play[type]();
        $('#play-skip').show();
        $('#play-message').hide();
        $('#play-submit').show();
        $('#play-next').hide();
        $('input[name="play-answer"]', '#play').each(function(){
            $(this).prop('checked', false).checkboxradio("refresh");
        });
        
        
        VF.trophyCheck();
        
        if(VF.data.gameType.indexOf('Time')!==-1){
            Play.startTimer();
        }
    };

    Play.nextDef = function(){
        var item,
            i=3;
        item = Play.getNewItem(false);
        Play.currentWord = item.def;
        Play.currentAnswer = item.word;

        Play.badAnswers = [];
        while(i--){
            Play.badAnswers.push(Play.getNewItem(true).word);
        }

        Play.updateHtml();
    };
    Play.nextWord = function(){
        var item,
            i=3;

        item = Play.getNewItem(false);
        Play.currentWord = item.word;
        Play.currentAnswer = item.def;

        Play.badAnswers = [];
        while(i--){
            Play.badAnswers.push(Play.getNewItem(true).def);
        }

        Play.updateHtml();
    };

    Play.getNewItem = function(isRandom){
        var wordNum = VF.utils.getRandomInt(0,VF.data.currentDictLength);
        while(((isRandom) ? Play.currentWordIndex === wordNum
                : $.inArray(wordNum, VF.data.finished[VF.data.currentDict]) !== -1)){
            wordNum = VF.utils.getRandomInt(0,VF.data.currentDictLength);
        }
        if(!isRandom) Play.currentWordIndex = wordNum;
        return VF.resources[VF.data.currentDict].list[wordNum];
    };

})(window.VF.controllers.play = VF.controllers.play || {}, document);