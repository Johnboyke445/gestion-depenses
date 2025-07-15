import { useEffect, useState } from 'react';

// On définit une interface TypeScript pour typer les objets catégorie
interface Category {
  id: number;     // identifiant unique de la catégorie
  name: string;   // nom de la catégorie
}

export default function CategoriesPage() {
  // État local qui contient la liste des catégories récupérées de l'API
  const [categories, setCategories] = useState<Category[]>([]);

  // État pour stocker la nouvelle catégorie saisie par l'utilisateur
  const [newCategory, setNewCategory] = useState('');

  // État pour savoir quelle catégorie est en cours de modification (par son ID)
  const [editingId, setEditingId] = useState<number | null>(null);

  //  État pour stocker le nouveau nom d'une catégorie lors de l'édition
  const [editName, setEditName] = useState('');

  // Fonction pour charger toutes les catégories depuis le backend
  async function fetchCategories() {
    const res = await fetch('http://localhost:3001/categories'); // Requête GET vers l'API
    const data = await res.json();
    try {
      setCategories(data); // On met à jour le state avec les données reçues
    } catch (error) {
      console.error('Erreur chargement catégories', error); // Si problème, on affiche une erreur dans la console
    }
  }

  //  Appel de l'API dès que le composant est monté (chargement initial)
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fonction pour ajouter une nouvelle catégorie
  async function addCategory() {
    if (!newCategory.trim()) return alert("Le nom de la catégorie ne peut pas être vide"); // Vérification que le champ n'est pas vide

    try {
      const res = await fetch('http://localhost:3001/categories', {
        method: 'POST', // Requête POST pour créer une nouvelle catégorie
        headers: { 'Content-Type': 'application/json' }, // On envoie des données JSON
        body: JSON.stringify({ name: newCategory }), // On envoie le nom dans le corps de la requête
      });

      if (res.ok) {
        setNewCategory(''); // On réinitialise le champ après ajout
        fetchCategories();  // On recharge la liste des catégories
      } else {
        alert('Erreur ajout catégorie'); // Si l'API retourne une erreur
      }
    } catch (error) {
      console.error(error);       // Problème réseau
      alert('Erreur réseau');
    }
  }

  // Fonction pour mettre à jour une catégorie existante
  async function updateCategory(id: number) {
    if (!editName.trim()) return alert("Le nom ne peut pas être vide"); // Vérifie que le champ n'est pas vide

    try {
      const res = await fetch(`http://localhost:3001/categories/${id}`, {
        method: 'PUT', // Méthode PUT pour la mise à jour
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }), // Envoie du nouveau nom
      });

      if (res.ok) {
        setEditingId(null);   // On quitte le mode édition
        setEditName('');
        fetchCategories();    // On recharge les données
      } else {
        alert('Erreur mise à jour'); // Erreur de l'API
      }
    } catch (error) {
      console.error(error);       // Problème réseau
      alert('Erreur réseau');
    }
  }

  // Le rendu du composant React
  return (
    <div style={{ padding: 20 }}>
      <h1>Gestion des catégories</h1>

      {/* Formulaire d'ajout de nouvelle catégorie */}
      <div>
        <input
          placeholder="Nouvelle catégorie"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)} // Met à jour l'état quand on tape
        />
        <button onClick={addCategory}>Ajouter</button>
      </div>

      <h2>Catégories existantes</h2>

      {/* Liste des catégories */}
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            {editingId === cat.id ? (
              // Mode édition
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)} // Met à jour le nom pendant qu'on édite
                />
                <button onClick={() => updateCategory(cat.id)}>Enregistrer</button>
                <button onClick={() => setEditingId(null)}>Annuler</button>
              </>
            ) : (
              // Mode affichage normal
              <>
                {cat.name}{' '}
                <button
                  onClick={() => {
                    setEditingId(cat.id);     // Active le mode édition pour cette catégorie
                    setEditName(cat.name);    // Remplit le champ avec la valeur actuelle
                  }}
                >
                  Modifier
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
