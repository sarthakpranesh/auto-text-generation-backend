const express = require("express")
const app = express()
const tf = require("@tensorflow/tfjs-node")
const path = require('path')
const cors = require("cors")


app.use(express.static('tfjs'));
app.use(cors())

//loading model
const handler = tf.io.fileSystem(path.join(__dirname, "model.json"));
var model;
const loadModel = async ()=>{
    model = await tf.loadLayersModel(handler);
    console.log("model loaded")
    await model.summary()
}
loadModel()

//loading self defined NLP preprocessing functions
const predict = require("./predict")

app.get("/", async (req, res)=>{
    var text = req.query.text
    var prediction = text
    var val;
    var result;
    var predictedWord
    if(model){
            for(var i = 0; i<8; i++){
                text = predict.text_to_sequence(text)
                text = predict.pad_sequence(text, 18, 1)
                val = await model.predictOnBatch(tf.tensor2d([text]))
                result = await val.arraySync()
                predictedWord = await predict.outputCleaner(...result)
                prediction = prediction + " " + predictedWord
                text = prediction
            }
        res.status(200).send({
            statusCode: 200,
            payload: {
                prediction,
                error: null,
            }
        })
    }
    else{
        res.status(500).send({
            statusCode: 500,
            payload: {
                prediction: null,
                error: "Model not yet started, Please try later!"
            }
        })
    }
})

const port = process.env.PORT || 8080

app.listen( port, ()=>{
    console.log("Server Started")
})