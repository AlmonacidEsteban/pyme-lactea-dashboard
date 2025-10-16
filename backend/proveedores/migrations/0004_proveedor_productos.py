# Generated manually for adding productos field to Proveedor

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('productos', '0001_initial'),
        ('proveedores', '0003_cuentaporpagar'),
    ]

    operations = [
        migrations.AddField(
            model_name='proveedor',
            name='productos',
            field=models.ManyToManyField(
                blank=True,
                help_text='Productos que vende este proveedor',
                related_name='proveedores',
                to='productos.Producto'
            ),
        ),
    ]