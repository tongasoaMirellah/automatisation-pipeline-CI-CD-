import express from 'express';
import db from './db.js';

const app = express();
app.use(express.json());

//ajouter
app.post('/favoris', async (req, res) => {
    const { titre, url } = req.body;

    if (!titre || !url) {
        return res.status(400).json({ error: "Le titre et url sont obligatoire"});
    }

    await db.run('INSERT INTO favorites (titre, url) VALUES (?, ?)', [titre, url]);
});

//recuperer et voir
app.get('/favoris', async (req, res) => {
    const liste = await db.all('SELECT * FROM favorites');
    res.json(liste);
});

//modifier
app.put('/favoris/:id', async (req, res) => {
    const { id }= req.params;
    const { titre, url } = req.body;

    const favorites=  await db.get('SELECT * FROM favorites WHERE id = ?', [id]);
    if (!favorites) {
        return res.status(400).json({ error : "Favori introuvable"});
    }

    const nouveauTitre = titre || favorites.titre;
    const nouveauUrl = url || favorites.url;

    await db.run(
        'UPDATE favorites SET titre = ?, url = ? WHERE id = ?', [nouveauTitre, nouveauUrl, id]
    );

    res.json({ message: `Favori numero ${id} mis a jour avec succes`});
});

//supprimer
app.delete('/favoris/:id', async (req, res) => {
    const {id} = req.params;
    await db.run('DELETE FROM favorites WHERE id = ?', [id]);
    res.json({message: `Favoris numero ${id} supprimee.`});
});

app.listen(3000, () => {
    console.log('Serveur est sur http://localhost:3000');
});