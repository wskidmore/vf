(function(Play,document,undefined){
    Play.id = 'play';
    Play.currentDict = '';
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
        $('#play-next-div').hide();

        Play.updateCorrectScore(0);
        Play.updateWrongScore(0);
    };
    Play.selectAnswer = function(){
        var selectedElement = $('input[name="play-answer"]:checked', '#play');
        Play.endTimer();

        if(selectedElement.length === 0) return;
        $('#play-submit-div').hide();
        $('#play-next-div').show();
        switch(selectedElement.val()){
            case '0':
                selectedElement.next('label').addClass('ui-btn-up-g');
                Play.answerIsCorrect();
            break;
            case '1':
                selectedElement.next('label').addClass('ui-btn-up-r');
                Play.answerIsWrong();
            break;
        }
        VF.save();
    };
    Play.showMessage = function(message){
        if($.isArray(message))
            message = VF.utils.randomArrayEl(message);
        $('#playTitle').text(message);
    };
    
    Play.answerIsCorrect = function(){
        Play.updateCorrectScore(1);
        Play.showMessage(VF.messages.correct);
        Play.addCurrentToFinished();
    };

    Play.addCurrentToFinished = function(){
        VF.finished[Play.currentDict.name].push(Play.currentWordIndex);
    };

    Play.answerIsWrong = function(){
        $('input[name="play-answer"][value="0"]', '#play').next('label').addClass('ui-btn-up-g');
        Play.updateWrongScore(1);
        Play.showMessage(VF.messages.wrong);
    };

    Play.updateCorrectScore = function(points){
        var tally = VF.answersTally[Play.currentDict.name];
        if(tally){
            VF.answersTally[Play.currentDict.name].correct += points;
        } else {
            VF.answersTally[Play.currentDict.name] = {
                correct: points,
                wrong: 0,
                total: Play.currentDictLength
            };
        }
        $('#correct').html(VF.answersTally[Play.currentDict.name].correct);
    };
    Play.updateWrongScore = function(points){
        var tally = VF.answersTally[Play.currentDict.name];
        if(tally){
            VF.answersTally[Play.currentDict.name].wrong += points;
        } else {
            VF.answersTally[Play.currentDict.name] = {
                correct: 0,
                wrong: points,
                total: Play.currentDictLength
            };
        }
        $('#wrong').html(VF.answersTally[Play.currentDict.name].wrong);
    };

    Play.updateHtml = function(){
        Play.cleanCSS();

        $('#word').html(Play.currentWord);
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
        if(el.next('label').children().length > 0){
            el.val(val).next('label').children().eq(0).children().eq(0).html(def);
        } else {
            el.val(val).next('label').html(def);
        }
    };

    Play.cleanCSS = function(){
        $('input[name="play-answer"]', '#play').each(function(){
            $(this).next('label').removeClass('ui-btn-up-g ui-btn-up-r');
        });
    };
    Play.startTimer = function(){
        Play.time = VF.timers[VF.gameType];
        Play.timer = setTimeout(Play.updateTimer,1000);
    };
    Play.updateTimer = function(){
        var seconds = Play.time,
            minutes = 0;

        while(seconds>=60){
            minutes += 1;
            seconds -= 60;
        }
        Play.time -= 1;
        $('#playTitle').html( VF.utils.padTo(minutes,2)+':'+VF.utils.padTo(seconds,2));


        if(seconds === 0) {
            $('#play-submit-div').hide();
            $('#play-next-div').show();
            Play.answerIsWrong();
        } else {
            Play.timer = setTimeout(Play.updateTimer, 1000);
        }
    };
    Play.endTimer = function(){
        clearTimeout(Play.timer);
    };
    Play.setDefaultTitle = function(){
        Play.showMessage(VF.name);
    };
    Play.next = function(){
        var type = 'next'+VF.gameType.replace('Timed','');
        Play[type]();
        $('#play-submit-div').show();
        $('#play-next-div').hide();
        Play.setDefaultTitle();
        $('input[name="play-answer"]', '#play').each(function(){
            $(this).prop('checked', false).checkboxradio("refresh");
        });
        if(VF.gameType.indexOf('Time')!==-1){
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
        var wordNum = VF.utils.getRandomInt(0,Play.currentDictLength);
        while(((isRandom)
                ? Play.currentWordIndex === wordNum
                : $.inArray(wordNum, VF.finished[Play.currentDict.name]) !== -1)){
            console.log('while looping');
            wordNum = VF.utils.getRandomInt(0,Play.currentDictLength);
        }
        if(!isRandom) Play.currentWordIndex = wordNum;
        return Play.currentDict.list[wordNum];
    };

})(window.VF.controllers.play = VF.controllers.play || {}, document);