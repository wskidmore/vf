(function(Settings,document,undefined){
    Settings.id = 'settings';
    Settings.init = function(){
        var soundEnabled = $('#settings-soundEnable');
        soundEnabled.prop("value",VF.preferences.soundEnabled || true);
        soundEnabled.slider("refresh");
        soundEnabled.change(function(evt){
            VF.preferences.soundEnabled = evt.target.value;
            VF.save();
        });
    };
    Settings.create = function(){
    };
})(window.VF.controllers.settings = VF.controllers.settings || {}, document);