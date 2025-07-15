import { NestFactory } from '@nestjs/core'; // Import du factory pour créer l'application NestJS
import { AppModule } from './app.module'; // Import du module principal de l'application
async function bootstrap() {
  // Création de l'application NestJS avec le module racine
  const app = await NestFactory.create(AppModule);

  // Autoriser le frontend sur localhost:3000 à accéder à l'API
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  // Démarrage du serveur sur le port défini dans les variables d'environnement
  // Sinon, par défaut, écoute sur le port 3001
  await app.listen(3001);
  // Affiche dans la console l'adresse où l'app est accessible
  console.log(`http://localhost:${process.env.PORT ?? 3001}`);
}
// Lance la fonction bootstrap pour démarrer l'application
bootstrap();
