(function(Trophy,document,undefined){
    Trophy.id = 'trophy';

    Trophy.create = function(){
        var listHtml = [];
        $.each(VF.trophy.trophies, function(i, item){
            item.earned = (VF.data.trophy[item.name]) ? 'trophy-light' : 'trophy-dark';
            listHtml.push(VF.utils.sub(Trophy.itemTemplate, item));
        });
        $('#trophy-list').html(listHtml.join(''));
    };
    Trophy.itemTemplate = '<li><a href="#" data-name="${name}">'+
        '<img src="../../content/images/${earned}.png">'+
        '<h3>${title}</h3>'+
        '<p>${description}</p>'+        
        '</a></li>';
        

    Trophy.init = function(){
        $('a', '#trophy-list').each(function(){
            var aNode = $(this);
            aNode.click(function(){
                var trophyName = aNode.attr('data-name'),
                    item = VF.trophy.get(trophyName)[0],
                    message = item.needed();
                VF.showMessage('Status',message);
            });
        });
    };


})(window.VF.controllers.trophy = VF.controllers.trophy || {}, document);