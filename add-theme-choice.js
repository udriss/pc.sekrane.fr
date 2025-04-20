const fs = require('fs');
const dataPath = '/var/www/pc.sekrane.fr/lib/data.json';

// Lire le fichier
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Ajouter themeChoice à chaque course
data.courses.forEach(course => {
  if (!course.hasOwnProperty('themeChoice')) {
    course.themeChoice = 0; // Valeur par défaut
  }
});

// Écrire le fichier modifié
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

