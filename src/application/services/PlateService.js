"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlateService = void 0;
const tf = __importStar(require("@tensorflow/tfjs"));
class PlateService {
    constructor(plateRepository) {
        this.plateRepository = plateRepository;
    }
    addPlate(plate) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.plateRepository.add(plate);
        });
    }
    trainModel(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const trainingData = yield this.plateRepository.training_data(token);
            console.log(trainingData);
            // Normalizar los datos de entrenamiento
            const maxCarbs = Math.max(...trainingData.map((item) => item.Carbohydrates));
            const maxProts = Math.max(...trainingData.map((item) => item.Proteins));
            const maxFats = Math.max(...trainingData.map((item) => item.Fats));
            const normalizedData = trainingData.map(item => ({
                Carbohydrates: item.Carbohydrates / maxCarbs,
                Proteins: item.Proteins / maxProts,
                Fats: item.Fats / maxFats,
                Sugar: item.Sugar
            }));
            console.log('normalizar completo');
            // Definir el modelo
            const model = tf.sequential();
            model.add(tf.layers.dense({ inputShape: [3], units: 8, activation: 'relu' }));
            model.add(tf.layers.dense({ units: 4, activation: 'relu' }));
            model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
            model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
            console.log('Definicion completa');
            // Entrenar el modelo
            const tensorData = tf.tensor2d(normalizedData.map(item => [item.Carbohydrates, item.Proteins, item.Fats]));
            const tensorLabels = tf.tensor2d(normalizedData.map(item => [Number(item.Sugar)]));
            console.log('data y labels');
            yield model.fit(tensorData, tensorLabels, {
                batchSize: 32,
                epochs: 50,
                shuffle: true,
                callbacks: {
                    onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch}: loss = ${logs === null || logs === void 0 ? void 0 : logs.loss}`),
                },
            });
            console.log('Entrenamiento completo');
            const plate = { Carbohydrates: 30, Proteins: 20, Fats: 10 };
            const inputTensor = tf.tensor2d([[plate.Carbohydrates, plate.Proteins, plate.Fats]]);
            const prediction = model.predict(inputTensor);
            const predictionValues = prediction instanceof Array ? prediction[0].arraySync() : prediction.arraySync();
            console.log(predictionValues);
        });
    }
}
exports.PlateService = PlateService;
