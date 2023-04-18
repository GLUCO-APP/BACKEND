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
exports.UserService = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const tf = __importStar(require("@tensorflow/tfjs"));
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    addUser(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.add(usuario);
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.userRepository.findEmail(email);
            const foundUser = yield user;
            if (foundUser) {
                const match = yield bcrypt.compare(password, foundUser.password);
                if (!match) {
                    return "contraseña incorrecta";
                }
                //const token = jwt.sign({email:foundUser.email},process.env.TOKEN_SECRET || 'tokentest')
                const token = this.userRepository.findToken(email);
                return token;
            }
            else {
                return "usuario no encontrado";
            }
        });
    }
    getToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tkUser = this.userRepository.getToken(token);
            const foundUser = yield tkUser;
            return foundUser;
        });
    }
    updateUser(usuario, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tkuser = this.userRepository.updateUser(usuario, token);
            const foundUser = yield tkuser;
        });
    }
    tensorTest() {
        const model = tf.sequential();
        const inputShape = [3];
        model.add(tf.layers.dense({ units: 1, inputShape }));
        model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
        const xs = tf.tensor2d([[250, 18, 1], [295, 21, 1], [270, 24, 1], [240, 14, 1], [250, 20, 1], [260, 19, 1], [250, 17, 1]]);
        const ys = tf.tensor2d([[110], [114], [175], [100], [159], [110], [116]]);
        model.fit(xs, ys, { epochs: 100 });
        const input = tf.tensor2d([[280, 16, 1]]);
        const prediction = model.predict(input);
        console.log(prediction.dataSync()[0]);
        const result = prediction.dataSync()[0].toString();
        return Promise.resolve(result);
    }
}
exports.UserService = UserService;
