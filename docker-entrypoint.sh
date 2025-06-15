set -e
# Fonction pour remplacer les variables d'environnement dans les fichiers JS
replace_env_vars() {
    echo "Remplacement des variables d'environnement..."
    
    # Remplace les placeholders dans les fichiers buildés
    find /usr/share/nginx/html -name "*.js" -exec sed -i \
        -e "s|REACT_APP_API_URL|${API_URL:-https://fakeapi.taskmaster.com}|g" \
        -e "s|REACT_APP_ENV|${NODE_ENV:-production}|g" \
        {} \;
        
    echo "Variables d'environnement configurées avec succès"
}

# Configuration des variables d'environnement au runtime
if [ "$1" = "nginx" ]; then
    replace_env_vars
fi

exec "$@"