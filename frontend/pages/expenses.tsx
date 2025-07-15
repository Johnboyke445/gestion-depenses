import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'; // Import des composants nécessaires pour afficher un graphique avec recharts

// Définition d'une catégorie avec un identifiant et un nom
interface Category {
  id: number;
  name: string;
}

// Définition d'une dépense avec montant, date, catégorie associée, etc.
interface Expense {
  id: number;
  amount: number;
  date: string;
  categoryId: number;
  category: Category;
}

export default function ExpensesPage() {
  // État pour stocker toutes les catégories récupérées depuis l'API
  const [categories, setCategories] = useState<Category[]>([]);

  // État pour stocker toutes les dépenses récupérées depuis l'API
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // États pour les champs du formulaire d'ajout
  const [amount, setAmount] = useState('');        // Montant de la dépense
  const [categoryId, setCategoryId] = useState(''); // ID de la catégorie sélectionnée
  const [date, setDate] = useState('');             // Date de la dépense

  // État pour stocker le résumé mensuel des dépenses par catégorie
  const [monthlySummary, setMonthlySummary] = useState< { month: string; category: string; total: number }[] >([]);

  // Charger les catégories au premier rendu de la page
  useEffect(() => {
    fetch('http://localhost:3001/categories')        // Appel à l'API des catégories
      .then((res) => res.json())                     // Conversion de la réponse en JSON
      .then(setCategories)                           // Stockage dans le state
      .catch((err) => console.error('Erreur chargement catégories', err));
  }, []);

  // Charger les dépenses au premier chargement
  useEffect(() => {
    fetchExpenses(); // Fonction définie plus bas
  }, []);

  
  // Fonction qui récupère toutes les dépenses depuis l'API
  async function fetchExpenses() {
    try {
      const res = await fetch('http://localhost:3001/expense'); // Requête GET
      const data = await res.json();  // Conversion de la réponse
      setExpenses(data);              // Mise à jour du state
    } catch (err) {
      console.error('Erreur chargement dépenses', err);
    }
  }

  // Prépare les données pour le graphique (date + montant)
    const chartData = expenses.map(exp => ({
      date: new Date(exp.date).toLocaleDateString(), // Formatage date
      amount: exp.amount,                            // Montant dépense
    }));

// Fonction pour récupérer le résumé mensuel depuis l'API
  async function fetchMonthlySummary() {
  try {
      const res = await fetch('http://localhost:3001/expense/summary/monthly'); // Appel API
      const data = await res.json();   // Transformation JSON
      setMonthlySummary(data);         // Stockage dans le state
    } catch (err) {
      console.error('Erreur chargement résumé mensuel', err); // En cas d’erreur
    }
  }

// Charger le résumé mensuel dès le chargement de la page
useEffect(() => {
  fetchMonthlySummary();
}, []);

  // Fonction appelée lors du clic sur "Ajouter"
  async function addExpense() {
    // Vérifie que tous les champs sont remplis
    if (!amount || !categoryId || !date) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Requête POST vers l'API pour ajouter une nouvelle dépense
    const res = await fetch('http://localhost:3001/expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // On envoie du JSON
      body: JSON.stringify({
        amount: parseFloat(amount),            // Conversion en nombre
        categoryId: parseInt(categoryId),      // Conversion en nombre
        date,                                  // La date au format string
      }),
    });

    // Si la requête est un succès, on vide les champs et recharge les dépenses
    if (res.ok) {
      setAmount('');
      setCategoryId('');
      setDate('');
      fetchExpenses();
    } else {
      alert("Erreur lors de l'ajout de la dépense");
    }
  }

function exportToPDF() {
 
  // crée un nouveau document PDF vide
  const doc = new jsPDF();

  // Ajouter un titre en haut du PDF à la position (x = 14, y = 10)
  doc.text('Liste des dépenses', 14, 10);

  // On utilise la bibliothèque autoTable pour générer un tableau automatiquement
  autoTable(doc, {
    head: [['Montant (€)', 'Date', 'Catégorie']],
     body: expenses.map((exp) => [
      exp.amount,                               // Colonne 1 : le montant de la dépense
      new Date(exp.date).toLocaleDateString(),  // Colonne 2 : la date formatée
      exp.category?.name || 'Non disponible',   // Colonne 3 : le nom de la catégorie ou 'Non disponible' si absent
    ]),
  });

  doc.save('depenses.pdf');
}

  // Rendu de l'interface
  return (
    <div style={{ padding: 20 }}>
      <h1>Ajouter une dépense</h1>

      {/* Formulaire d'ajout d'une dépense */}
      <div>
        <input
          type="number"
          placeholder="Montant"
          value={amount}
          onChange={(e) => setAmount(e.target.value)} // Met à jour l'état quand on tape
        />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={addExpense}>Ajouter</button>
      </div>

       {/* Graphique */}
      <h2>Visualisation des dépenses</h2>
      <div style={{ width: '100%', height: 300 }}>
         {/* Conteneur responsive */}
        <ResponsiveContainer>
         { /* Le composant principal du graphique en ligne (LineChart) avec les données à afficher*/}
          <LineChart data={chartData}>
              {/* Grille de fond */}
            <CartesianGrid stroke="#ccc" />
             {/* Axe horizontal pour les dates */}
            <XAxis dataKey="date" />
            {/* Axe vertical automatique des montants */}
            <YAxis />
            {/* Info-bulle */}
            <Tooltip />
            {/* Courbe montants */}
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Affichage de la liste des dépenses enregistrées */}
      <h2>Dépenses enregistrées</h2>
      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            {exp.amount} € | {new Date(exp.date).toLocaleDateString()} | {exp.category?.name}
          </li>
        ))}
      </ul>

      <h2>Résumé mensuel des dépenses par catégorie</h2>
          <ul>
        {monthlySummary.map((item, index) => ( // On parcourt chaque entrée du résumé (une par combinaison mois + catégorie)
          <li key={index}>
            {/* Affiche une ligne comme : "Juillet 2025 | Alimentation : 200 €" */}
            {item.month} | {item.category} : {item.total} €
          </li>
        ))}
      </ul>

      
     <button onClick={exportToPDF} style={{ marginTop: 20, marginBottom: 10 }}>
      Exporter en PDF
    </button>

    </div>
  );
}
