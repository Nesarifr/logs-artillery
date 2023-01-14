import * as dotenv from "dotenv";
import parsedArgs from "minimist";


const envFile = ".env";


dotenv.config({
    path: envFile
});

export const config = {
    MONGOURLBD: process.env.MONGOURLBD,
    MONGOURLSESSION: process.env.MONGOURLSESSION

};