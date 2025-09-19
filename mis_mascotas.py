import time
import os
import random

pets = ["🐶", "🐱", "🐹", "🐰"]
directions = ["→", "←"]

tasks = [
    "Cargando datos confidenciales...",
    "Analizando patrones complejos...",
    "Entrenando modelo predictivo...",
    "Generando reportes estadísticos...",
    "Validando integridad del sistema..."
]

print("¡Mis mascotas están trabajando conmigo en VS Code! 🖥️🐾\n")
time.sleep(1)

# Animación de animalitos + proyecto falso
for i in range(10):
    os.system("cls")  # limpiar consola en Windows

    # Animalitos
    line = ""
    for pet in pets:
        line += pet + " " + directions[i % 2] + "   "
    print(line)
    
    # Tarea falsa
    task = random.choice(tasks)
    print(f"\n[Proyecto secreto] {task}")
    
    time.sleep(0.7)

print("\n✅ Sistema completado. Informe listo para entregar. 📊🗂️")
