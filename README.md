# VocabFun (VF)

jQuery Mobile application used to aid acquiring new vocabulary via a question based system.

## Contributing

Trello (activities): https://trello.com/board/vocabfun/4e968b02206191958a25a46b

Cloud9 (development): http://c9.io/wskidmore/vf

## Goal

The purpose of VF (VocabFun) is to create a simple HTML5/Webapp vocabulary game that enables easy plugging in of various word sets.

## Setup

Clone the repo, run index.html in a HTML5 web browser (Chrome, FireFox, Safari, IE9, etc)

## To add a new set of words:

Edit src/dict-resources.json to add a new object including your name, description and file location:

`````
    {
        "name": "Your Set Name",
        "description": "Your Set Description",
        "file": "src/dict/your-dict.json"
    }
`````


Inside your-dict.json file is a single JSON object using the following schema:

`````
    {
        "modes": ["word","def"],
        "list":[
            {"word":"your word", "def":"your definition"},
            ...
        ]
    }
`````    

### modes: [array of strings]

word: Displays the word to the user and they must select the correct definition out of a list of four.

def: Displays the definition to the user and they must select the correct word out of a list of four.

More modes are planned.

### list: [array of objects]

List is an array of word objects. A word object has two keys, word and def. The word value will be a string of a single word. The def value will be the correlating definition of the word.

---
