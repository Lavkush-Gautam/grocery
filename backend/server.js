import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDb from './config/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoutes.js';
import sellerRouter from './routes/sellerRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import addressRouter from './routes/address.routes.js';
import orderRouter from './routes/order.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
const port = process.env.PORT || 4000;


// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

// CORS configuration
const allowedOrigin = ['http://localhost:5173'];
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));

// Connect to the database
await connectDb();

// Define routes
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

const projectRoot = path.resolve(__dirname, '..'); 

// Serve frontend build files
// Now we join projectRoot with 'frontend/dist'
app.use(express.static(path.join(projectRoot, 'frontend', 'dist')));

// Catch-all route to serve the frontend's index.html
// Again, resolve from projectRoot
app.get('/{*path}', (req, res) => {
  res.sendFile(path.resolve(projectRoot, 'frontend', 'dist', 'index.html'));
});


// Root route
app.get('/', (req, res) => {
    res.send('API is working');
});

// Start the server
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
