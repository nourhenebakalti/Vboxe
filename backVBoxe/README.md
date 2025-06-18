mvn clean package  si vous avez déjà maven installer dans votre pc

mvn clean : Cette commande supprime le répertoire target, où Maven stocke les fichiers compilés et les fichiers de sortie des compilations précédentes. Cela garantit que vous commencez avec une arborescence de répertoires propre.

mvn package : Cette commande compile le code, exécute les tests unitaires (s'il y en a), et assemble le résultat dans un fichier .jar qui se trouve dans le répertoire target.

Le fichier (jar) généré se trouve généralement dans : target/nom-du-projet-version.jar
mvn clean install : Cela installera également le JAR dans le dépôt local Maven