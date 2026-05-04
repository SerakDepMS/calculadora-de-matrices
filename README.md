# Calculadora de Matrices

![Logo SerakDepMS](image/SerakDepMS.png)

Aplicación web desarrollada con **HTML, CSS y JavaScript puro**. Permite agregar múltiples matrices con dimensiones personalizadas, editar sus valores en tiempo real y realizar las operaciones más importantes del álgebra lineal. Incluye un diseño responsive, iconos personalizados y una interfaz moderna sin dependencias externas.

## Funcionalidades principales

- **Agregar matrices dinámicamente** con solo pulsar un botón, definiendo sus dimensiones (1×1 hasta 10×10) mediante un modal interactivo.
- **Redimensionar** cualquier matriz existente sin perder los valores previos (se rellenan con ceros las nuevas celdas).
- **Eliminar matrices** con confirmación.
- **Edición en vivo** de cada celda, con ajuste automático del ancho para números largos (enteros, decimales, negativos).
- **Panel de operaciones** que incluye:
  - Suma (A + B)
  - Resta (A − B)
  - Multiplicación (A × B)
  - Multiplicación por escalar (k × A)
  - Transpuesta (Aᵀ)
  - Determinante (|A|)
  - Inversa (A⁻¹)
- **Visualización clara del resultado** en un panel dedicado, con celdas que se expanden según el tamaño del número.
- **Guardar resultado** como una nueva matriz para seguir operando.
- **Interfaz profesional** con iconos SVG, sombras, transiciones suaves y paleta de colores modernos.
- **Completamente responsive**: adaptado a escritorio, tablet y móvil.

## Ejemplos rápidos

- **Suma/Resta**: Crea dos matrices de 2×2, rellénalas y selecciona "Suma (A + B)".
- **Multiplicación**: Crea una matriz 2×3 y otra 3×2, selecciona "Multiplicación (A × B)".
- **Determinante**: Crea una matriz cuadrada (ej. 3×3) y elige "Determinante |A|".
- **Inversa**: Con una matriz cuadrada no singular, obtén su inversa.

## Tecnologías utilizadas

- **HTML5**: Estructura semántica, modales, SVGs.
- **CSS3**: Flexbox, Grid, transiciones, animaciones, diseño responsivo.
- **JavaScript (ES6)**: Manipulación del DOM, eventos, arrays bidimensionales, algoritmos de álgebra lineal (eliminación gaussiana para inversa/determinante).

## Derechos de autor

© 2026 **D3B1A2C4F5E67890**. Todos los derechos reservados.

El código fuente y los archivos asociados de este proyecto están protegidos por derechos de autor.  
Queda prohibida su copia, modificación, distribución o uso sin autorización previa y por escrito del autor.

## Autor

**D3B1A2C4F5E67890**  
Proyecto desarrollado con fines educativos y profesionales, demostrando la potencia de las tecnologías web estándar para construir herramientas matemáticas interactivas.

*Explora el álgebra lineal de forma visual, dinámica y precisa.*  
[**🔗 Acceder a la calculadora de matrices**](https://serakdepms.github.io/calculadora-de-matrices/)