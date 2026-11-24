const express = require('express');
const {logger, notFound, errorHandler} = require('./middleware');

const booksRouter = require('./route/book');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Book Library Management API',
        name: 'Zidane Putra',
        theme: 'Library'
    });
});

app.use('/books', booksRouter);

app.get('/files/*path', (req, res) => {
    res.status(200).json({
        path: req.params.path
    });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});