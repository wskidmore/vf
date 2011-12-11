(function(Util,document,undefined){
    Util.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };
    Util.randomArrayEl = function(array){
        return array[Util.getRandomInt(0, array.length)];   
    };
    Util.padTo = function(number, size){
        size -= number.toString().length;
        if (size > 0)
            return new Array( size+ (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
        return number;
    };
    Util.sub = function(template,obj) {
		return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(match,key){ return obj[key]; });
	};
    Util.setObject = function(key, value){
        localStorage.setItem(key, JSON.stringify(value));
    };
    Util.getObject = function(key){
        var item = localStorage.getItem(key);
        return item ? JSON.parse(item) : {};
    };
    Util.isObjectEmpty = function(obj){
       for(var key in obj) {
          if (obj.hasOwnProperty(key))
             return false;
       }
       return true;
    };
    Util.clamp = function(val, min, max){
        return Math.max(min, Math.min(max, val));    
    };
    Util.playSound = function(soundId){
        var node = document.getElementById(soundId);
        if(!VF.data.preferences.soundEnabled || !node) 
            return;
        node.pause();
        node.play();
    };


})(window.VF.utils = VF.utils || {}, document);