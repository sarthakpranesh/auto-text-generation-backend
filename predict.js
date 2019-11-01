const embedded_words = require("./embedded")

const text_to_sequence = (text)=>{
    var textLowerCase = text.toLowerCase();
    var textArray = textLowerCase.split(" ")
    var sequentialText = []
    for(var i = 0; i<textArray.length; i++){
        if(Object.keys(embedded_words).includes(textArray[i])){
            sequentialText.push(embedded_words[textArray[i]])
        }else{
            sequentialText.push(1)
        }
    }
    return sequentialText
}

const pad_sequence = (text, maxLength, pre=0)=>{
    var padded = []
    var n = text.length
    for(var i = 0; i<maxLength-1; i++){
        padded.push(0)
    }
    if(pre){
        for(var j = n; j>0; j--){
            padded[maxLength-j] = text[n-j]
        }
    } else{
        for(var j = 0; j<n; j++){
            padded[j] = text[j]
        }
    }
    return padded
}

const outputCleaner = async (result)=>{
    var resultMax = Math.max(...result)
    const predictedWord = await Object.keys(embedded_words)[result.indexOf(resultMax)]
    return predictedWord
}

module.exports = {
    text_to_sequence,
    pad_sequence,
    outputCleaner
}