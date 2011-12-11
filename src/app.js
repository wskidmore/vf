(function(VF,document,undefined){
    
    VF.data = {
        answersTally: {},
        currentDict: null,
        currentDictLength: 0,
        finished: {},
        gameType: 'word',
        resources: {},
        numDicts: 0,
        preferences: {
            soundEnabled: true    
        }
    };

    VF.controllers = {};
    VF.loadAttempts = 0;
    VF.sounds = {
        "correct": "sound-correct",
        "wrong": "sound-wrong"
    };
    VF.timers = {
        'WordTimed' : 10,
        'DefTimed' : 60,
        'PatternTimed' : 120,
        'OddTimed' : 30
    };
    VF.loading = true;
    VF.messages = {};
    VF.name = "VocabFun";

    VF.save = function(){
        VF.utils.setObject('vfdata', VF.data);
    };
    VF.load = function(){
        var loaded = VF.utils.getObject('vfdata');
        if(loaded && !VF.utils.isObjectEmpty(loaded)) {
            VF.data = loaded;
            return true;
        }
        return false;
    };
    VF.init = function(){
        VF.loadControllers();
        VF.loadResources();
        VF.loadMessages();
        VF.loadEvents();

        var loaded = VF.load();
        if(loaded)
            VF.addResume();
            
        $( $.mobile.initializePage );
    };
    VF.addResume = function(){
        var link = $('<li><a href="#">Resume</a></li>');
        $('#home-list').prepend(link);
        link.click(function(){
            VF.startGame('src/views/');
        });
    };
    VF.startGame = function(root){
        VF.loadAttempts++;
        if(VF.data.numDicts > 0) {
            $.mobile.changePage(root+'play.html');
            VF.controllers.play.next();
            return;
        }
        if(VF.loadAttempts > 30){
            alert('Unable to start - timed out.');
            return;
        }
        setTimeout(VF.startGame, 500);
    };
    
    VF.loadControllers = function(){
        var controller, currentController;
        for(controller in VF.controllers){
            currentController = VF.controllers[controller];
            $('#'+currentController.id).live('pagecreate', currentController.create);
            $('#'+currentController.id).live('pageinit', currentController.init);
        }
    };
    VF.loadMessages = function(){
        if(!VF.utils.isObjectEmpty(VF.data.messages)) return;
        $.ajax({
            url: 'src/messages.json',
            dataType: 'json',
            success: function(data) {
                VF.messages = data;
            },
            error: function(){
                console.log(arguments);
                alert('Error: Could not load messages!');
            }
        });
    };
    VF.loadResources = function(){
        if(!VF.utils.isObjectEmpty(VF.data.resources)) return;
        $.ajax({
            url: 'src/dict-resources.json',
            dataType: 'json',
            success: function(data) {
                var dictLength = data.dictionaries.length,
                    i=0,
                    dictionary = {};

                for(i = 0; i < dictLength; i += 1){
                    dictionary = data.dictionaries[i];
                    dictionary.max = dictLength;
                    $.ajax({
                        url: dictionary.file,
                        dataType: 'json',
                        context: dictionary,
                        success: VF.loadDictSuccess
                    });
                }
            },
            error: function(){
                console.log(arguments);
                alert('Error: Could not load resources!');
            }
        });
    };
    VF.loadDictSuccess = function(data){
        $.extend(this, data);
        VF.data.resources[this.name] = this;
        VF.data.finished[this.name] = VF.data.finished[this.name] || [];
        VF.data.numDicts += 1;
        // todo:  add some sort of event?
        if(VF.data.numDicts === this.max) {
            VF.loading = false;
            if($('.ui-page-active').attr('id') === 'play')
                VF.controllers.play.next();
        }
    };
    
    
    VF.loadEvents = function(){
        var $window = $(window);
        $window.bind('orientationchange', VF.onOrientationChange);
        $window.trigger('orientationchange');
    };
    VF.onOrientationChange = function(evt){
        $('html').removeClass('portrait landscape').addClass(evt.orientation);
    };


})(window.VF = window.VF || {}, document);