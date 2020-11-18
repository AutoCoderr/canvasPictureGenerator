#Pour faire fonctionner le projet
    - Aller dans le dossier pexel, afin d'executer la commande : npm install
      pour installer les dépendances
    - Retournez dans le dossier parent, et executez : docker-compose up [-d]

#Liste des dépendances extérieures :
    - API de conceptNet (Pour récupérer d'autres mot, en rapport avec le mot donné)
    - Pexel (Une API, pour récupérer une image en rapport avec le mot donné)
    - Colorthief (Pour récupérer la couleur dominante d'une image)
    - Un bout de code récupéré sur un site (http://www.webtoolkit.info/javascript_sha1.html#.X7Ve1a4o85l) 
      pour pouvoir effectuer un hash sha1
    - La lib Axios pour se connecter en http aux APIs
    - Divers lib pour le serveur http nodejs (url, http)