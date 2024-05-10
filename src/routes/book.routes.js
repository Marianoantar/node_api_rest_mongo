const express = require('express');
const router = express.Router(); // Este es el Router de express
const Book = require('../models/book.models'); // tenemos el modelo del Book
const bookModels = require('../models/book.models');

// MIDLEWARE
const getBook = async(req, res, next) => {
    let book;
    const { id } = req.params; //toma el id de los parametros del req 

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json(
            { 
                message: 'Id invalido' 
            });
    }

    try {
        book = await Book.findById(id);
        if (!book) return res.status(404).json(
            {
                message: 'Libro no encontrado'
            })
    } catch (error) {
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }

    res.book = book; //Configura la respuesta res.book con el valor de book
    next(); // Ejecuta el next()
};

// Obtener todos los libros  [GET ALL]
 router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('GET ALL', books);
        if (bookModels.length === 0) {
            return res.status(204).json([])
        }
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo Libro [POST] 
router.post('/', async (req, res) => {
    const {title, author, genre, publication_date} = req?.body;
    if (!title || !author || !genre || !publication_date) {
        return res.status(400).json({ message: 'Faltan datos' });
    }
    const book = new Book({
        title: title,
        author: author,
        genre: genre,
        publication_date: publication_date
    });

    try {
        const newBook = await book.save();
        console.log(newBook);
        res.status(201).json(newBook);
        
    } catch (error) {
        res.status(400).json({ 
            message: error.message
        })
    }

    

})

// Get Individual
router.get('/:id', getBook, async (req, res) => {
    res.json(res.book)
});

// Update Individual
router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save();
        res.json(updatedBook);

    } catch (error) {
        res.status(400).json({message: error.message});
    }
});


// Update 
router.patch('/:id', getBook, async (req, res) => {
    if (!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date) {
    res.status(404).json({
        message: 'Al menos debe ser enviado uno de los campos'
        })
    }
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save();
        res.json(updatedBook);

    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Delete 
router.delete('/:id', getBook, async (req, res) => {
try {
    const book = res.book;
    await book.deleteOne({
        _id: book._id
    });  
    res.json({
        message: `Libro ${book.title} borrado correctamente`
    })  
} catch (error) {
    res.status(500).json({message: error.message
    })
}});




module.exports = router
