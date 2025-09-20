from django.contrib import admin
from .models import Cliente

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ("nombre", "identificacion", "correo", "telefono")  # sin 'activo'
    search_fields = ("nombre", "identificacion", "correo")
    list_filter = ()  # vacío o podrías usar por ejemplo ('correo',) pero no filtra tan bien

