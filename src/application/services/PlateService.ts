import { MySQLPlateRepository } from "../../infrastructure/repositories/MySQLPlateRepository";
import { Plate } from "../../domain/entities/Plate";
import * as tf from '@tensorflow/tfjs';
import { trdata } from "../../domain/entities/trdata";

export class PlateService {

    private plateRepository: MySQLPlateRepository;

    constructor(plateRepository:MySQLPlateRepository){
        this.plateRepository = plateRepository;
    }

    public async addPlate(plate:Plate):Promise<Plate> {
        return this.plateRepository.add(plate);
    }

    public async trainModel(token: string){
    
        const trainingData : trdata[] = await this.plateRepository.training_data(token);
        console.log(trainingData);
        // Normalizar los datos de entrenamiento
        const maxCarbs = Math.max(...trainingData.map((item: trdata) => item.Carbohydrates));
        const maxProts = Math.max(...trainingData.map((item: trdata) => item.Proteins));
        const maxFats = Math.max(...trainingData.map((item: trdata) => item.Fats));
        const normalizedData = trainingData.map(item => ({
            Carbohydrates: item.Carbohydrates / maxCarbs,
            Proteins: item.Proteins / maxProts,
            Fats: item.Fats / maxFats,
            Sugar: item.Sugar
          }));
          console.log('normalizar completo');
           // Definir el modelo
          const model = tf.sequential();
          model.add(tf.layers.dense({inputShape: [3], units: 8, activation: 'relu'}));
          model.add(tf.layers.dense({units: 4, activation: 'relu'}));
          model.add(tf.layers.dense({units: 1, activation: 'linear'}));
          model.compile({loss: 'meanSquaredError', optimizer: 'adam'});
          console.log('Definicion completa');
         // Entrenar el modelo
          const tensorData = tf.tensor2d(normalizedData.map(item => [item.Carbohydrates, item.Proteins, item.Fats]));
          const tensorLabels = tf.tensor2d(normalizedData.map(item => [Number(item.Sugar)]));
          console.log('data y labels');
          await model.fit(tensorData, tensorLabels, {
            batchSize: 32,
            epochs: 50,
            shuffle: true,
            callbacks: {
              onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch}: loss = ${logs?.loss}`),
            },
          });
          console.log('Entrenamiento completo');
            const plate = { Carbohydrates: 30, Proteins: 20, Fats: 10 };
            const inputTensor = tf.tensor2d([[plate.Carbohydrates, plate.Proteins, plate.Fats]]);
            const prediction = model.predict(inputTensor);
            const predictionValues = prediction instanceof Array ? prediction[0].arraySync() : prediction.arraySync();
            console.log(predictionValues);
    }
}