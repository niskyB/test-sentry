import * as dotenv from 'dotenv';
import { config } from '../config';

const initTest = () => {
    dotenv.config({
        path: `config/.env.${process.env.NODE_ENV}`,
    });

    console.log(config);
};

export default initTest;
