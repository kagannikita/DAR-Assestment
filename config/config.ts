import dotenv from 'dotenv';

dotenv.config();

const MONGO_OPTIONS = {
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  poolSize: 50,
  autoIndex: false,
  retryWrites: false,
};
const MONGO_USERNAME = process.env.MONGO_USERNAME || 'Nikita';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'kagan2156';
const MONGO_HOST = process.env.MONGO_URL || 'cluster0.e8dla.mongodb.net/myFirstDatabase';

const MONGO = {
  host: MONGO_HOST,
  username: MONGO_USERNAME,
  password: MONGO_PASSWORD,
  options: MONGO_OPTIONS,
  url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`,
};
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || 'english-club';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_NAME || '625255788471379';
const CLOUDINARY_API_SECRET_KEY = process.env.CLOUDINARY_NAME || '7RcKGwlwk1nSOK5AJwQmzHldaJw';

const CLOUDINARY = {
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET_KEY,
};
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'coolIssuer';
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || 'superencryptedsecret';

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const PORT = process.env.PORT || 3000;
const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: PORT,
  token: {
    expireTime: SERVER_TOKEN_EXPIRETIME,
    issue: SERVER_TOKEN_ISSUER,
    secret: SERVER_TOKEN_SECRET,
  },
};
const config = {
  mongo: MONGO,
  server: SERVER,
  cloudinary: CLOUDINARY,
};
export default config;
