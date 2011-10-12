# VocabFun (VF)

jQuery Mobile application used to aid acquiring new vocabulary via a question based system.

## To add a new set of words:

Edit src/dict-resources.json to include your name, description and file location:

`````
    {
        "name": "Your Set Name",
        "description": "Your Set Description",
        "file": "path/to/dict.json"
    }
`````


Add your dictionary.json file using the following notation:

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

####More modes to come

### list: [array of objects]

List is an array of word objects. A word object has two keys, word and def.

