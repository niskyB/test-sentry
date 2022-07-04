import { monoEnum } from 'mono-utils-core';

export const config = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USERNAME: process.env.DB_USERNAME || 'postgresdocker',
    DB_PASSWORD: process.env.DB_PASSWORD || '1234567890',
    DB_NAME: process.env.DB_NAME || 'myapp',
    DB_PORT: Number(process.env.DB_PORT) || 5432,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_SECRET: process.env.GOOGLE_SECRET || '',
    GOOGLE_CLIENT_REDIRECT_URL: process.env.GOOGLE_CLIENT_REDIRECT || 'http://localhost:4000',

    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || '',
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '',
    FACEBOOK_CLIENT_REDIRECT_URL: process.env.FACEBOOK_CLIENT_REDIRECT || 'http://localhost:4000',

    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'this is secret',
    CLIENT_URL: (process.env.CLIENT_URL || 'http://localhost:3000').split(','),
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:4000',

    SENDGRID_KEY: process.env.SENDGRID_KEY || '',
    SENDGRID_SENDER: process.env.SENDGRID_SENDER || '',
    SENDGRID_URL: process.env.SENDGRID_URL || '',

    PORT: Number(process.env.PORT) || 4000,
    NODE_ENV: process.env.NODE_ENV || monoEnum.NODE_ENV_MODE.DEVELOPMENT,
    DEBUG: process.env.DEBUG || '',

    AWS_REGION: process.env.AWS_REGION || '',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    AWS_BUCKET: process.env.AWS_BUCKET || '',

    MOMO_SECRET_CONFIG_KEY: process.env.MOMO_SECRET_CONFIG_KEY || '',
    MOMO_URL: process.env.MOMO_URL || '',
    MOMO_IPN_URL: process.env.MOMO_IPN_URL || '',
    MOMO_REDIRECT_URL: process.env.MOMO_REDIRECT_URL || '',
    MOMO_REQUEST_PATH: process.env.MOMO_REQUEST_PATH || '',
    MONO_PARTNER_CODE: process.env.MONO_PARTNER_CODE || '',
    MOMO_REQUEST_CONTENT_TYPE: process.env.MOMO_REQUEST_CONTENT_TYPE || '',
    MOMO_ACCESS_KEY: process.env.MOMO_ACCESS_KEY || '',
    MOMO_LANG: process.env.MOMO_LANG || '',
    MOMO_REQUEST_TYPE: process.env.MOMO_REQUEST_TYPE || '',
};
