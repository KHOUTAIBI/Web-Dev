async function getData() {

    // To replace with axios later
    const carsDataResponse = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
    const carsData = await carsDataResponse.json();
    const cleaned = carsData.map(car => ({
      mpg: car.Miles_per_Gallon,
      horsepower: car.Horsepower,
    })).filter(car => (car.mpg != null && car.horsepower != null));
  
    return cleaned;
  }
  

async function plotData(){
    const data = await getData();
    const values = data.map(d => ({
        x: d.horsepower,
        y: d.mpg,
      }));
    
      tfvis.render.scatterplot(
        {name: 'Horsepower v MPG'},
        {values},
        {
          xLabel: 'Horsepower',
          yLabel: 'MPG',
          height: 300
        }
      );    
    
    return;
}


function createModel(){
    const model = tf.sequential();
    model.add(tf.layers.dense({
        inputShape : [1],
        units : 1,
        useBias : true
    }));

    model.add(tf.layers.dense(
      {units: 50, 
      activation: 'relu',
    }));

    model.add(
        tf.layers.dense({
            units : 1,
            useBias : true,
        })
    );

    return model;
}

function convertToTensor(data){
  return tf.tidy( () => {
    tf.util.shuffle(data);
    const inputs = data.map(d => d.horsepower)
    const labels = data.map(d => d.mpg);
    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);


    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    }

  })
}

async function trainModel(model, inputs, labels) {
  // Prepare the model for training.
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  });

  const batchSize = 32;
  const epochs = 100;

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'mse'],
      { height: 200, callbacks: ['onEpochEnd'] }
    )
  });
}

function testmodel(model,inputData,normalizationData){
    const {inputMax,inputMin,labelMax,labelMin} = normalizationData;

    const [xpredict, ypredict] = tf.tidy(() => {
      const xNorm = tf.linspace(0,1,100);

      const prediction = model.predict(xNorm.reshape([100,1]));

      const unNormXs = xNorm
      .mul(inputMax.sub(inputMin))
      .add(inputMin);

      const unNormPreds = prediction
      .mul(labelMax.sub(labelMin))
      .add(labelMin);

      return [unNormXs.dataSync(),unNormPreds.dataSync()];
    });

    const predictions = Array.from(xpredict).map((value,index) => {
      return {
        x : value,
        y : ypredict[index],
      }
    });

    const originalPoints = inputData.map(d => ({
      x: d.horsepower, y: d.mpg,
    }));
    
    tfvis.render.scatterplot(
      {name: 'Model Predictions vs Original Data'},
      {values: [originalPoints, predictions], series: ['original', 'predicted']},
      {
        xLabel: 'Horsepower',
        yLabel: 'MPG',
        height: 300
      }
    );
  
}



document.addEventListener("DOMContentLoaded",(event)=> {

    document.getElementById('fetch-data').addEventListener('click', async () =>{
      
      const model = createModel();
      tfvis.show.modelSummary({name: 'Model Summary'}, model);
      plotData()
      const data = await getData();
      let tensorData = convertToTensor(data);
      let inputs = tensorData.inputs;
      let labels = tensorData.labels;
      await trainModel(model,inputs,labels);

      console.log('finished training, plotting the predictions !');
      testmodel(model,data,tensorData);
    });
    
    
})
