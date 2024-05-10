const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: String,
        author: String,
        genre: String,
        publication_date: String
})

// exportar como modelo de mongo 
module.exports = mongoose.model('Book', bookSchema);    
    