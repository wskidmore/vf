(function(Type,document,undefined){
    Type.id = 'type';

    Type.create = function(){
        $('button[data-play]').click(function(){
            VF.gameType = $(this).attr('data-play');
            $.mobile.changePage('play.html');
            if(VF.numDicts > 0){
                VF.controllers.play.next();
            }
        });

    };


})(window.VF.controllers.type = VF.controllers.type || {}, document);