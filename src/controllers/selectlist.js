(function(SelectList,document,undefined){
    SelectList.id = 'selectlist';

    SelectList.create = function(){
        var listsHtml = '',
            resNames = [],
            sortedResources = [];
        $.each(VF.resources, function(){
            resNames.push(this.name);
        });
        resNames.sort();
        $.each(resNames, function(){
            sortedResources.push(VF.resources[this]);
        });

        
        $.each(sortedResources, function(){
            listsHtml += SelectList.addList(this);
        });

        $('#selectlist-wordLists').append(listsHtml).fieldcontain('refresh', true);

        $('#selectlist-play').click(function(){
            var dictName = $('#selectlist-wordLists input:radio[name=selectlist-wordList]:checked').val(),
                dict = SelectList.selectDict(dictName),
                dictLength = dict.list.length;
            VF.controllers.play.currentDict = dict;
            VF.controllers.play.currentDictLength = dictLength;
            $.mobile.changePage('type.html');
        });
    };
    SelectList.selectDict = function(name){
        return VF.resources[name];
    };
    SelectList.addList = function(list){
        var template = '<input type="radio" name="selectlist-wordList" id="radio-${name}" value="${name}" />'+
        '<label for="radio-${name}">${name}</label>';
        return VF.utils.sub(template,list);
    };
    SelectList.init = function(){
    };


})(window.VF.controllers.selectlist = VF.controllers.selectlist || {}, document);