#!/bin/bash

# Script de emergência para corrigir cache corrompido em produção
# Execute este script quando receber erros como "Class 'view' does not exist"

echo "🔧 Corrigindo cache corrompido em produção..."

# 1. Limpar todos os caches manualmente
echo "1. Limpando arquivos de cache..."
rm -f bootstrap/cache/config.php
rm -f bootstrap/cache/routes-v7.php
rm -f bootstrap/cache/services.php
rm -f bootstrap/cache/packages.php

# 2. Limpar cache de pacotes antes de regenerar autoload
echo "2. Limpando cache de pacotes..."
rm -f bootstrap/cache/packages.php

# 3. Limpar via Artisan (se possível)
php artisan optimize:clear 2>/dev/null || echo "⚠️  Não foi possível executar optimize:clear"

# 4. Regenerar autoload do Composer (sem --no-dev para evitar problemas com package discovery)
echo "3. Regenerando autoload do Composer..."
composer dump-autoload --optimize

# 5. Limpar cache de storage
echo "4. Limpando cache de storage..."
rm -rf storage/framework/cache/data/*
rm -rf storage/framework/views/*

# 6. Recriar caches (apenas se não houver erros)
# echo "5. Recriando caches..."
# php artisan config:cache
# php artisan route:cache
# php artisan view:cache

echo "✅ Cache corrigido! Teste a aplicação agora."

