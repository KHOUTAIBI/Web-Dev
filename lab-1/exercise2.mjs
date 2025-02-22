"use scrict";

export function wordCount(word_sentence){
    let occurences = {};
    let word_sentence_array = word_sentence.trim("").split(" ");
    word_sentence_array.map((element) =>  occurences[element] = 0);
    for (const element of word_sentence_array){
        occurences[element] +=1; 
    } 
    return occurences;
}

export class WordList{

    constructor(word){
        this.word = word;
    }

    getWords(){
        let word_sentence_array = this.word.trim().split(" ");
        let sorted_array =  word_sentence_array.sort();
        function unique_array(array){
            let occurence = array[0];
            let unique_array = [];
            unique_array.push(array[0]);
            for (const element of array){
                if (occurence !== element){
                    unique_array.push(element);
                    occurence = element;
                }
            }
            return unique_array
        }
        let sorted_array_unique = unique_array(sorted_array);
        return sorted_array_unique;
    }

    maxCountWord(){
        let occurences = wordCount(this.word);
        function max_index(objects){    
            let max_index = 0;
            for(const object in objects){
                if (objects[object] > max_index){
                    max_index = objects[object];
                }
            }
            return max_index;
        }
        let maximum_index = max_index(occurences); 
        return this.getWords(this.word).filter((e,index) => occurences[e] === maximum_index)[0];
    }

    minCountWord(){
        let occurences = wordCount(this.word);
        function min_index(objects){
            let min_index = Infinity;
            for(const object in objects){
                console.log(object)
                if (objects[object] < min_index){
                    min_index = objects[object];
                }
            }
            return min_index;
        } 
        let minimum_index = min_index(occurences); 
        return (this.getWords(this.word)).filter((e,index) => occurences[e] === minimum_index)[0]; 
    }

    getCount(word){
        let occurences = wordCount(this.word);
        if (occurences[word] === undefined){
            return 0;
        } 
        return occurences[word];
    }

    applyWordFunc(f){
        let sorted_array = this.getWords(this.word);
        return sorted_array.map((element) => f(element));
    }
}
