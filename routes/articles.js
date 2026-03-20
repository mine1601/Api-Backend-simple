// articles.js

const express = require('express');
const router = express.Router();

// Sample data storage (replace with your database logic)
let articles = [];

// Create a new article
router.post('/', (req, res) => {
    const { titre, contenu, auteur, categorie, tags } = req.body;
    const newArticle = { id: articles.length + 1, titre, contenu, auteur, categorie, tags };
    articles.push(newArticle);
    res.status(201).json(newArticle);
});

// Read all articles
router.get('/', (req, res) => {
    res.status(200).json(articles);
});

// Read an article by id
router.get('/:id', (req, res) => {
    const article = articles.find(a => a.id == req.params.id);
    if (article) {
        res.status(200).json(article);
    } else {
        res.status(404).json({ message: 'Article not found' });
    }
});

// Update an article
router.put('/:id', (req, res) => {
    const article = articles.find(a => a.id == req.params.id);
    if (article) {
        const { titre, contenu, auteur, categorie, tags } = req.body;
        article.titre = titre || article.titre;
        article.contenu = contenu || article.contenu;
        article.auteur = auteur || article.auteur;
        article.categorie = categorie || article.categorie;
        article.tags = tags || article.tags;
        res.status(200).json(article);
    } else {
        res.status(404).json({ message: 'Article not found' });
    }
});

// Delete an article
router.delete('/:id', (req, res) => {
    const articleIndex = articles.findIndex(a => a.id == req.params.id);
    if (articleIndex !== -1) {
        articles.splice(articleIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Article not found' });
    }
});

// Search articles
router.get('/search', (req, res) => {
    const { titre, auteur, categorie, tags } = req.query;
    const filteredArticles = articles.filter(article => {
        return (
            (!titre || article.titre.includes(titre)) &&
            (!auteur || article.auteur.includes(auteur)) &&
            (!categorie || article.categorie.includes(categorie)) &&
            (!tags || article.tags.some(tag => tags.split(',').includes(tag)))
        );
    });
    res.status(200).json(filteredArticles);
});

module.exports = router;