// Migration script pour convertir les emojis en noms d'icônes Material UI
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapping des emojis vers les noms d'icônes Material UI
const emojiToIconMap: Record<string, string> = {
  '📝': 'edit',
  '📅': 'calendar',
  '📚': 'school',
  '📖': 'book',
  '✏️': 'create',
  '🎯': 'explore',
  '💡': 'lightbulb',
  '🔔': 'notifications',
  '⭐': 'star',
  '❤️': 'favorite',
  '📌': 'pin',
  '🏆': 'trophy',
  '🎉': 'celebration',
  '🎨': 'palette',
  '🎵': 'music',
  '🎬': 'movie',
  '📷': 'camera',
  '🔗': 'link',
  '📊': 'chart',
  '💬': 'chat',
  '📄': 'pdf',
  '🎥': 'video',
  '📹': 'video',
  '🖼️': 'camera'
};

async function migrateEmojisToIcons() {
  console.log('🚀 Début de la migration des emojis vers les icônes Material UI...');

  try {
    // Récupérer toutes les progressions
    const progressions = await prisma.progression.findMany();
    
    console.log(`📊 ${progressions.length} progressions trouvées`);

    let updatedCount = 0;
    
    for (const progression of progressions) {
      if (progression.icon && emojiToIconMap[progression.icon]) {
        const newIconName = emojiToIconMap[progression.icon];
        
        await prisma.progression.update({
          where: { id: progression.id },
          data: { icon: newIconName }
        });
        
        console.log(`✅ Progression ${progression.id}: ${progression.icon} → ${newIconName}`);
        updatedCount++;
      }
    }

    console.log(`🎉 Migration terminée! ${updatedCount} progressions mises à jour`);

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la migration si ce fichier est lancé directement
if (require.main === module) {
  migrateEmojisToIcons();
}

export { migrateEmojisToIcons, emojiToIconMap };
