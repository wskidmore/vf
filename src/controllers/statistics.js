(function(Stats,document,undefined){
    Stats.id = 'stats';

    Stats.create = function(){
        var statContent = [];
        for(var dict in VF.data.answersTally){
            statContent.push(Stats.addBar(dict, VF.data.answersTally[dict]));
        }
        $('#statistics-list').append(statContent.join(''));
        Stats.applySizes();
    };
    Stats.applySizes = function(){
        var barPieces = $('div.statBar > div.info');
        barPieces.each(function(i, node){
            Stats.updateSize(node);
        });
    };
    Stats.updateSize = function(node){
        var $$ = $(node),
            total = parseFloat($$.attr('data-total'), 10),
            current = parseFloat($$.attr('data-current'), 10),
            percentage =  (current / total) * 100;
        if(percentage > 10) percentage -= 1;
        percentage = VF.utils.clamp(percentage, 1,99);
        $$.css('width', percentage+'%');
    };

    Stats.addBar = function(name, answerInfo){
        var template = [
            '<div data-role="collapsible" data-collapsed="true">',
            '<h2>',name,'</h2>',
            '<p>Correct: ${correct}<br/>',
            '<p>Remaining: ',VF.utils.clamp((answerInfo.total - answerInfo.correct),0,answerInfo.total),
            '<div class="statBar">',
                '<div class="info correct" data-total="${total}" data-current="${correct}"></div>',
                '<div class="info remaining" data-total="${total}" data-current="',
                    answerInfo.total - answerInfo.correct,
                '">',
                '</div>',
            '</div>',
            '</div>'
        ].join('');
        return VF.utils.sub(template, answerInfo);
    };
    Stats.init = function(){
    };
    

})(window.VF.controllers.stats = VF.controllers.stats || {}, document);