import { Request, Response } from 'express';
const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});