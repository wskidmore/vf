(function(VF,document,undefined){
    VF.controllers = {};
    VF.resources = null;
    VF.numDicts = 0;
    VF.finished = {};
    VF.answersTally = {};
    VF.gameType = 'word';
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
    VF.keysToSave = [
        'finished','answersTally','gameType', 'preferences'
    ];
    VF.loading = true;
    VF.messages = {};
    VF.name = "VocabFun";
    VF.preferences = {
        soundEnabled: true    
    };


    VF.save = function(){
        $.each(VF.keysToSave, function(index, key){
            VF.utils.setObject(key, VF[key]);
        });
    };
    VF.load = function(){
        $.each(VF.keysToSave, function(index, key){
            VF[key] = VF.utils.getObject(key);
        });
    };
    VF.init = function(){
        VF.loadControllers();
        VF.loadResources();
        VF.loadMessages();
        VF.loadEvents();
        VF.load();
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
        VF.resources = {};
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
        VF.resources[this.name] = this;
        VF.finished[this.name] = VF.finished[this.name] || [];
        VF.numDicts += 1;
        // todo:  add some sort of event?
        if(VF.numDicts === this.max) {
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