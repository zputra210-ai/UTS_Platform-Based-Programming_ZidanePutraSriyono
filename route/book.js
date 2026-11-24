const express = require('express');
const {requireAuth} = require('../middleware');

const router = express.Router();


let books =[
    {
        id: 1,
        title: "Berfilsafat dari Konteks",
        author: "Franz Magnis Suseno",
        genre: "Philosophy",
        year: 2026,
        available: true
    },
    {
        id: 2,
        title: "Laut Bercerita",
        author: "Leila S. Chudori",
        genre: "Historical Fiction",
        year: 2022,
        available: true

    },
    {
        id: 3,
        title: "Pemikiran Karl Marx: Dari Sosialisme Utopis ke Perselisihan Revisionisme",
        author: "Franz Magnis Suseno",
        genre: "Philosophy",
        year: 2025,
        available: true 
    },
    {
        id: 4,
        title: "Dilema Usaha Manusia Rasional: Teori Kritis Sekolah Frankfurt",
        author: "SINDHUNATA",
        genre: "Philosophy",
        year: 2025,
        available: true
    },
    {
        id: 5,
        title: "Tubuh yang Mengetahui: Belajar dari Fenomenalogi di Era Mesin Meniru Segalanya",
        author: "Fransisco Budi Hardiman",
        genre: "Philosophy",
        year: 2025,
        available: true
    }
];

// Helper function Book by ID
const findbookbyId = (id) => {
    return books.find(book => book.id === Number(id));
};

// Helper generate New ID
let nextBookId = Math.max(
    ...books.map(book => book.id), 0
)+ 1;

const generateBookId = () => {
    return nextBookId++;
};

// Mengambil Semua Buku
router.get('/', (req, res) => {
    res.status(200).json({
        message: "Books Retrieved Successfully",
        data: books
    });
});

// Tambah Data Buku Baru | POST
router.post('/', (req, res) => {
    const {title, author, genre, year, available} = req.body || {};

    if(
        typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        typeof genre !== "string" || !genre.trim() ||
        typeof year !== "number" || !Number.isInteger(year) ||
        typeof available !== "boolean"
    ){
        return res.status(400).json({
            message: "Invalid Input, All book fields are required."
        });
    } else {
        const newBook = {
            id: generateBookId(),
            title: title.trim(),
            author: author.trim(),
            genre: genre.trim(),
            year,
            available
        };

        books.push(newBook);

        return res.status(201).json({
            message: "Book Added Successfully",
            data: newBook
        });
    }
});

// Filter Book by Genre | GET
router.get('/category{/:name}', (req, res) => {
    const {name} = req.params;

    if (!name){
        return res.status(200).json({
            message: "All Books Retrieved Successfully",
            data: books
        });
    }

    const filteredBooks = books.filter(
        book => book.genre.toLowerCase() === name.toLowerCase()
    );

    return res.status(200).json({
        message: 'Books Filtered Successfully',
        data: filteredBooks
    });
});


// GET, PUT, DELETE
router.route('/:id')

    // Get one Book
    .get(async (req, res) => {
        const book = findbookbyId(req.params.id);

        if(!book){
            const error = new Error('Book Not Found');
            error.status = 404;
            throw error;
        }
        res.status(200).json({
            message: "Book Retrieved Successfully",
            data: book
        });
    })

    // Update Data Book
    .put(async (req, res) => {
        const book = findbookbyId(req.params.id);

        if(!book){
            const error = new Error('Book Not Found');
            error.status = 404;
            throw error;
        }

        const{title, author, genre, year, available} = req.body || {};

        if (
            typeof title !== "string" || !title.trim() ||
            typeof author !== "string" || !author.trim() ||
            typeof genre !== "string" || !genre.trim() ||
            typeof year !== "number" || !Number.isInteger(year) ||
            typeof available !== "boolean"
        ){
            return res.status(400).json({
                message: "Invalid Input, All book fields are required."
            });
        }

        book.title = title.trim();
        book.author = author.trim();
        book.genre = genre.trim();
        book.year = year;
        book.available = available;

        res.status(200).json({
            message: "Book updated successfully",
            data: book
        });
    })

    // Delete Book
    .delete(requireAuth, async (req, res) => {
        const book = findbookbyId(req.params.id);

        if(!book){
            const error = new Error("Book Not Found");
            error.status = 404;
            throw error;    
        }

        books = books.filter(
            item => item.id !== Number(req.params.id)
        );

        res.status(200).json({
            message: "Book Deleted Successfully",
            data: book
        });
    });

module.exports = router;