(function(VF,document,undefined){
    
    VF.data = {
        answersTally: {
            _correct: 0,
            _wrong: 0,
        },
        currentDict: null,
        currentDictLength: 0,
        finished: {},
        gameType: 'word',
        correctStreak: 0,
        trophy: {},
        numDicts: 0,
        preferences: {
            soundEnabled: true    
        }
    };
    VF.resources = {};


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
        VF.initNodeScroll();
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
        if(!VF.utils.isObjectEmpty(VF.resources)) return;
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
        VF.data.finished[this.name] = VF.data.finished[this.name] || [];
        VF.data.numDicts += 1;
        // todo:  add some sort of event?
        if(VF.data.numDicts === this.max) {
            VF.loading = false;
            if($('.ui-page-active').attr('id') === 'play')
                VF.controllers.play.next();
        }
    };
    VF.trophyCheck = function(){
        $.each(VF.trophy.trophies, function(i, item){
            if(VF.data.trophy[item.name]) return;
            
            var earned = item.hasEarned(VF.data);
            if (!earned) return;
            
            VF.data.trophy[item.name] = true;
            VF.showMessage(item.title, item.description, 'trophy-light');
        });
    };
    
    VF.showMessage = function(title, message, icon){
        $('#message-title').html(title);
        $('#message-message').html(message)
        if(icon)
            $('#message-icon').attr('src','../../content/images/'+icon+'.png').show();
        else 
            $('#message-icon').hide();
        $.mobile.changePage( $("#message"), { role: "dialog"} );
    };
    
    VF.loadEvents = function(){
        var $window = $(window);
        $window.bind('orientationchange', VF.onOrientationChange);
        $window.trigger('orientationchange');
    };
    VF.onOrientationChange = function(evt){
        $('html').removeClass('portrait landscape').addClass(evt.orientation);
    };
    VF.initNodeScroll = function (elm) {
		var SafariWindowHeightFix = 34; // XXX:
		if (elm.data("iscroll-plugin")) {
			return;
		}

		// XXX: fix crumbled css in transition changePage 
		// for jquery mobile 1.0a3 in jquery.mobile.navigation.js changePage
		//  in loadComplete in removeContainerClasses in .removeClass(pageContainerClasses.join(" "));
		elm.css({
			overflow: 'hidden'
		});

		var barHeight = 0;
		var $header = elm.find('[data-role="header"]');
		if ($header.length) {
			$header.css({
				"z-index": 1000,
				padding: 0,
				width: "100%"
			});
			barHeight += $header.height();
		}

		var $footer = elm.find('[data-role="footer"]');
		if ($footer.length) {
			$footer.css({
				"z-index": 1000,
				padding: 0,
				width: "100%"
			});
			barHeight += $footer.height();
		}

		var $wrapper = elm.find('[data-role="content"]');
		if ($wrapper.length) {
			$wrapper.css({
				"z-index": 1
			});
	//		$wrapper.height($(window).height() - barHeight);
		}

		var iscroll = new iScroll($wrapper.get(0), {desktopCompatibility: true});
		elm.data("iscroll-plugin", iscroll);
	};
	VF.setScrolls = function(){
		$('[data-role="page"][data-iscroll="enable"]').live("pagecreate", function() {
			console.log('calling');
			VF.initNodeScroll($(this));
		});
	};

})(window.VF = window.VF || {}, document);