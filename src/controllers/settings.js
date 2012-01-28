(function(Settings,document,undefined){
    Settings.id = 'settings';
    Settings.init = function(){
        var soundEnabled = $('#settings-soundEnable');
        soundEnabled.prop("value",VF.data.preferences.soundEnabled || true);
        soundEnabled.slider("refresh");
        soundEnabled.change(function(evt){
            VF.data.preferences.soundEnabled = evt.target.value;
            VF.save();
        });
        $('#settings-clear').click(function(){
            if (window.localStorage)
                window.localStorage.clear();
			VF.removeResume();
            alert('All Saved Data Erased');
        });
        
    };
    Settings.create = function(){
    };
})(window.VF.controllers.settings = VF.controllers.settings || {}, document);