import dotenv from 'dotenv';
import express, {
   type Request,
   type Response,
   type NextFunction,
} from 'express';
import router from './routes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
   process.env.CLIENT_URL,
   'https://chatbotservers.vercel.app',
   'https://chat-bot-client-ivory.vercel.app',
   'https://hilarychatbot.vercel.app',
];

// Simple CORS middleware that returns the proper headers for allowed origins
app.use((req: Request, res: Response, next: NextFunction) => {
   const origin = req.headers.origin as string | undefined;
   if (!origin) {
      // no origin (server-to-server or curl) — allow
      res.setHeader('Access-Control-Allow-Origin', '*');
   } else if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
   }

   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

   if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
   }

   next();
});

app.use(express.json());
app.use(router);

const port = process.env.port || 3000;

app.listen(port, () =>
   console.log(`Server is running on http:localhost:${port}`)
);
