"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const url_1 = require("url");
const dto_1 = require("./dto/dto");
const secretengine_1 = require("./secretengine/secretengine");
const port = 7090;
//const todos: { id: number; text: string }[] = [];
let y = new dto_1.SecretRecord("ABC123", 'MYAPP1', 'DBPASSWD', '');
const server = http_1.default.createServer((req, res) => {
    const { pathname, query } = (0, url_1.parse)(req.url, true);
    console.log('here', req.url);
    if (req.method === 'POST' && pathname === '/process/secrets') {
        console.log('here');
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            var sc;
            sc = JSON.parse(data);
            yield secretengine_1.seng.RetrieveSecret(sc);
            console.log(sc);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(sc));
        }));
    }
});
// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
