(function(Type,document,undefined){
    Type.id = 'type';

    Type.create = function(){
        $('a[data-play]', '#'+Type.id).click(function(){
            VF.data.gameType = $(this).attr('data-play');
            VF.startGame('');
        });

    };
    Type.init = function(){
    };


})(window.VF.controllers.type = VF.controllers.type || {}, document);