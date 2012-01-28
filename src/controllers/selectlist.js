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

		var cats = [];
		for (var key in categories){
			cats.push(key);
		}
		cats.sort();
		
		$.each(cats, function(i, key){
            listsHtml += SelectList.startCategory(key);
            $.each(categories[key], function(index, item){
                listsHtml += SelectList.addList(item);
            });
            listsHtml += SelectList.endCategory;
        });
        $('#selectlist-wordLists').append(listsHtml)
        $('#selectlist-wordList').fieldcontain('refresh', true);

        $('.selectlist-play', '#selectlist').click(function(){
            var dictName = $('#selectlist-wordLists input:radio[name=selectlist-wordList]:checked').val(),
                dict = VF.resources[dictName],
                dictLength = dict.list.length;
            VF.data.currentDict = dictName;
            VF.data.currentDictLength = dictLength;
            $.mobile.changePage('type.html');
        });
    };
    SelectList.startCategory = function(category){
        var template = '<div class="ui-selectlist-cat"><h2 style="margin-bottom: 0px; padding: 3px 0px 3px 6px;" class="ui-title ui-bar-b ui-shadow ui-corner-top">${category}</h2>';
        return VF.utils.sub(template,{category:category});
    };
    SelectList.endCategory = '</div>';
    SelectList.addList = function(list){
        var template = '<input type="radio" name="selectlist-wordList" id="radio-${name}" value="${name}" />'+
        '<label for="radio-${name}">${name} - <span class="minor">${description}</span></label>';
        return VF.utils.sub(template,list);
    };
    SelectList.init = function(){
    };


})(window.VF.controllers.selectlist = VF.controllers.selectlist || {}, document);