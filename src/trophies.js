(function(Trophy,document,undefined){
    Trophy.get = function(name){
        return $.grep(Trophy.trophies, function(item){
            if(item.name === name) return true;
        });
    };
    Trophy.trophies = [
        {
            "name":"teninrow",
            "title": "Aced Ten",
            "description":"Get 10 correct answers in a row",
            "needed": function(){
                return 'Current streak: '+VF.data.correctStreak;
            },
            "hasEarned": function(data){
                if(data.correctStreak >= 10) return true;
                return false;    
            }
        },
        {
            "name":"twentyfiveinrow",
            "title": "25 Streak",
            "description":"Get 25 correct answers in a row",
            "needed": function(){
                return 'Current streak: '+VF.data.correctStreak;
            },
            "hasEarned": function(data){
                if(data.correctStreak >= 25) return true;
                return false;    
            }
        },
        {
            "name":"fiftyinrow",
            "title": "50 Wizard",
            "description":"Get 50 correct answers in a row",
            "needed": function(){
                return 'Current streak: '+VF.data.correctStreak;
            },
            "hasEarned": function(data){
                if(data.correctStreak >= 50) return true;
                return false;    
            }
        },
        {
            "name":"twentyfiveinrow",
            "title": "75 Master",
            "description":"Get 75 correct answers in a row",
            "needed": function(){
                return 'Current streak: '+VF.data.correctStreak;
            },
            "hasEarned": function(data){
                if(data.correctStreak >= 75) return true;
                return false;    
            }
        },
        {
            "name":"hundredinrow",
            "title": "100 All-knowning",
            "description":"Get 100 correct answers in a row",
            "needed": function(){
                return 'Current streak: '+VF.data.correctStreak;
            },
            "hasEarned": function(data){
                if(data.correctStreak >= 100) return true;
                return false;    
            }
        },
        {
            "name":"fivetotal",
            "title": "Thirst For Knowledge",
            "description":"5 correct answers",
            "needed": function(){
                return 'Current correct answers: '+VF.data.answersTally._correct;
            },
            "hasEarned": function(data){
                if(data.answersTally._correct >= 5) return true;
                return false;    
            }
        },        
        {
            "name":"hundredtotal",
            "title": "Word Apprentice",
            "description":"100 correct answers",
            "needed": function(){
                return 'Current correct answers: '+VF.data.answersTally._correct;
            },
            "hasEarned": function(data){
                if(data.answersTally._correct >= 100) return true;
                return false;    
            }
        },        
        {
            "name":"fivehundredtotal",
            "title": "Word Journeyman",
            "description":"500 correct answers",
            "needed": function(){
                return 'Current correct answers: '+VF.data.answersTally._correct;
            },
            "hasEarned": function(data){
                if(data.answersTally._correct >= 500) return true;
                return false;    
            }
        },        
        
        {
            "name":"thousandtotal",
            "title": "Word Wizard",
            "description":"1000 correct answers",
            "needed": function(){
                return 'Current correct answers: '+VF.data.answersTally._correct;
            },
            "hasEarned": function(data){
                if(data.answersTally._correct >= 1000) return true;
                return false;    
            }
        }
    ];
})(window.VF.trophy = VF.trophy || {}, document);