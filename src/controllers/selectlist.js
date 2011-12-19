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

        var categories = {};
        $.each(sortedResources, function(){
            if(categories[this.category])
                categories[this.category].push(this);
            else
                categories[this.category] = [this];
        });
        for(var key in categories){
            listsHtml += SelectList.startCategory(key);
            $.each(categories[key], function(index, item){
                listsHtml += SelectList.addList(item);
            });
        };

        $('#selectlist-wordLists').append(listsHtml).fieldcontain('refresh', true);

        $('#selectlist-play').click(function(){
            console.log(VF);
            var dictName = $('#selectlist-wordLists input:radio[name=selectlist-wordList]:checked').val(),
                dict = VF.resources[dictName],
                dictLength = dict.list.length;
            VF.data.currentDict = dictName;
            VF.data.currentDictLength = dictLength;
            $.mobile.changePage('type.html');
        });
    };
    SelectList.startCategory = function(category){
        var template = '<h2 style="margin-bottom: 1px; padding: 3px 0px 3px 6px;" class="ui-title ui-bar-b ui-shadow ui-corner-all">${category}</h2>';
        return VF.utils.sub(template,{category:category});
    };
    SelectList.addList = function(list){
        var template = '<input type="radio" name="selectlist-wordList" id="radio-${name}" value="${name}" />'+
        '<label for="radio-${name}">${name}</label>';
        return VF.utils.sub(template,list);
    };
    SelectList.init = function(){
    };


})(window.VF.controllers.selectlist = VF.controllers.selectlist || {}, document);