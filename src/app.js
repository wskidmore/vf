(function(VF,document,undefined){
    VF.controllers = {};
    VF.resources = null;
    VF.numDicts = 0;
    VF.finished = {};
    VF.answersTally = {};
    VF.gameType = 'word';
    VF.timers = {
        'WordTimed' : 10,
        'DefTimed' : 60,
        'PatternTimed' : 120,
        'OddTimed' : 30
    };
    VF.keysToSave = [
        'finished','answersTally','gameType'
    ];
    VF.loading = true;

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
        VF.loadEvents();
        VF.load();
    };
    VF.loadControllers = function(){
        var controller, currentController;
        for(controller in VF.controllers){
            currentController = VF.controllers[controller];
            $('#'+currentController.id).live('pagecreate', currentController.create);
        }
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
                        success: function(data){
                            $.extend(this, data);
                            VF.resources[this.name] = this;
                            VF.finished[this.name] = [];
                            VF.numDicts += 1;
                                /* add some sort of event?? */
                            if(VF.numDicts === this.max) {
                                VF.loading = false;
                                if($('.ui-page-active').attr('id') === 'play')
                                    VF.controllers.play.next();
                            }
                        }
                    });
                }
            },
            error: function(){
                console.log(arguments);
                alert('Error: Could not load resources!');
            }
        });
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