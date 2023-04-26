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

    public async trainModel(token: string):Promise<Plate[]>{
    
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

        // Definir el modelo
        const model = tf.sequential();
        model.add(tf.layers.dense({ inputShape: [1], units: 16, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
        model.compile({ loss: 'meanSquaredError', optimizer: tf.train.adam(0.001) });

        // Entrenar el modelo
        const tensorData = tf.tensor2d(normalizedData.map(item => [item.Carbohydrates]));
        const tensorLabels = tf.tensor2d(normalizedData.map(item => [Number(item.Carbohydrates)]));
        await model.fit(tensorData, tensorLabels, {
            batchSize: 32,
            epochs: 1000,
            shuffle: true,
            callbacks: {
                onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch}: loss = ${logs?.loss}`),
            },
        });

        // Hacer una predicción
        const plate = trainingData[trainingData.length - 1];
        const inputTensor = tf.tensor2d([[plate.Carbohydrates / maxCarbs]]);
        const prediction = model.predict(inputTensor);
        const predictionValue = prediction instanceof Array ? prediction[0].arraySync() : prediction.arraySync();
        console.log(Number(predictionValue) * maxCarbs);
        const estimacion  =  Number(predictionValue) * maxCarbs
         const recPlates : Plate[] = await this.plateRepository.publicPlates();
         const tolerancia = 5;
        const similarPlates = recPlates.filter((plate:Plate) => {
            return Math.abs(plate.Carbohydrates-estimacion) <= tolerancia;
        });
        console.log(similarPlates);
        return similarPlates;
    }
}