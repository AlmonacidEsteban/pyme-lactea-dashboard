#!/usr/bin/env python
"""
Script para debuggear las URLs registradas en Django
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.urls import get_resolver
from django.conf import settings

def print_urls(urlpatterns, prefix=''):
    """Imprime recursivamente todas las URLs registradas"""
    for pattern in urlpatterns:
        if hasattr(pattern, 'url_patterns'):
            # Es un include, recursivamente imprimir
            new_prefix = prefix + str(pattern.pattern)
            print(f"📁 {new_prefix} -> INCLUDE")
            print_urls(pattern.url_patterns, new_prefix)
        else:
            # Es una URL final
            url = prefix + str(pattern.pattern)
            name = getattr(pattern, 'name', 'NO_NAME')
            view = getattr(pattern, 'callback', 'NO_VIEW')
            print(f"🔗 {url} -> {view} (name: {name})")

def main():
    print("=== ANÁLISIS COMPLETO DE URLs ===")
    
    # 1. Obtener el resolver principal
    resolver = get_resolver()
    
    print("\n1. TODAS LAS URLs REGISTRADAS:")
    print_urls(resolver.url_patterns)
    
    print("\n2. VERIFICANDO URLs ESPECÍFICAS DE CLIENTES:")
    
    # Intentar resolver URLs específicas
    test_urls = [
        '/api/clientes/',
        '/api/clientes/rubros/',
        '/api/clientes/1/',
        '/api/clientes/rubros/1/',
    ]
    
    for test_url in test_urls:
        try:
            match = resolver.resolve(test_url)
            print(f"✅ {test_url} -> {match.func} (args: {match.args}, kwargs: {match.kwargs})")
        except Exception as e:
            print(f"❌ {test_url} -> ERROR: {e}")
    
    print("\n3. VERIFICANDO VIEWSETS IMPORTADOS:")
    try:
        from clientes.views import ClienteViewSet, RubroViewSet
        print(f"✅ ClienteViewSet importado: {ClienteViewSet}")
        print(f"✅ RubroViewSet importado: {RubroViewSet}")
        
        # Verificar queryset de RubroViewSet
        print(f"📊 RubroViewSet queryset: {RubroViewSet.queryset}")
        print(f"📊 RubroViewSet serializer: {RubroViewSet.serializer_class}")
        
    except Exception as e:
        print(f"❌ Error importando ViewSets: {e}")
    
    print("\n4. VERIFICANDO ROUTER DE CLIENTES:")
    try:
        from clientes.urls import cliente_router, rubro_router
        print(f"✅ Cliente router URLs: {[str(p.pattern) for p in cliente_router.urls]}")
        print(f"✅ Rubro router URLs: {[str(p.pattern) for p in rubro_router.urls]}")
    except Exception as e:
        print(f"❌ Error con routers: {e}")
    
    print("\n=== FIN DEL ANÁLISIS ===")

if __name__ == '__main__':
    main()