# 🚀 Guía de Contribución

¡Gracias por tu interés en contribuir a Los Sartenes! Apreciamos tu tiempo y esfuerzo. Por favor, tómate un momento para revisar esta guía antes de enviar tus contribuciones.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Reportar Errores](#reportar-errores)
- [Solicitar Características](#solicitar-características)
- [Primeros Pasos](#primeros-pasos)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Estándares de Código](#estándares-de-código)
- [Pruebas](#pruebas)
- [Preguntas Frecuentes](#preguntas-frecuentes)

## 📜 Código de Conducta

Este proyecto y todos los participantes se rigen por nuestro [Código de Conducta](CODE_OF_CONDUCT.md). Al participar, se espera que respetes este código. Por favor, reporta cualquier comportamiento inaceptable a [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com).

## ❓ ¿Cómo puedo contribuir?

Hay muchas formas en que puedes contribuir a este proyecto:

- 🐛 Reportar errores
- 💡 Sugerir mejoras
- 📝 Mejorar la documentación
- 🛠️ Corregir errores
- ✨ Añadir nuevas características
- 🧪 Escribir pruebas
- 🎨 Mejorar el diseño
- 🌍 Traducir a otros idiomas

## 🐛 Reportar Errores

Antes de reportar un error, por favor:

1. Verifica que el error no haya sido reportado ya en los [issues](https://github.com/tu-usuario/los-sartenes/issues).
2. Si no existe, crea un nuevo issue con una descripción clara.

**Plantilla para reportar errores:**

```markdown
## Descripción del Error

[Descripción clara y concisa del error]

## Pasos para reproducir

1. Ir a '...'
2. Hacer clic en '...'
3. Desplazarse hasta '...'
4. Ver error

## Comportamiento esperado

[Descripción de lo que debería suceder]

## Capturas de pantalla

[Si es aplicable, añade capturas de pantalla para ayudar a explicar el problema]

## Entorno

- Dispositivo: [ej. iPhone 12, PC con Windows 10]
- Navegador: [ej. Chrome 90, Firefox 88]
- Versión de Node.js: [ej. 16.0.0]

## Información adicional

Cualquier otra información adicional sobre el problema.
```

## 💡 Solicitar Características

¡Nos encantan las sugerencias de nuevas características! Por favor:

1. Asegúrate de que la característica no haya sido solicitada ya.
2. Explica por qué esta característica sería útil.
3. Describe cómo debería funcionar.

## 🚦 Primeros Pasos

1. Haz un fork del repositorio
2. Clona tu fork:
   ```bash
   git clone https://github.com/tu-usuario/los-sartenes.git
   cd los-sartenes
   ```
3. Crea una rama para tu característica o corrección:
   ```bash
   git checkout -b feature/nombre-de-tu-caracteristica
   ```
4. Instala las dependencias:
   ```bash
   npm install
   ```
5. Crea un archivo `.env` basado en `.env.example` y configura las variables necesarias.
6. Realiza tus cambios.
7. Asegúrate de que los tests pasan:
   ```bash
   npm test
   ```
8. Formatea tu código:
   ```bash
   npm run format
   ```
9. Haz commit de tus cambios con un mensaje descriptivo:
   ```bash
   git commit -m "feat: añadir nueva característica"
   ```
10. Haz push a tu rama:
    ```bash
    git push origin feature/nombre-de-tu-caracteristica
    ```
11. Abre un Pull Request.

## 🔄 Proceso de Pull Request

1. Asegúrate de que tu rama esté actualizada con la rama principal.
2. Describe claramente los cambios realizados.
3. Incluye capturas de pantalla o animaciones si es necesario.
4. Asegúrate de que todos los tests pasan.
5. Espera la revisión del equipo.

## 📏 Estándares de Código

- Sigue el estilo de código existente.
- Usa ESLint y Prettier para mantener la consistencia.
- Escribe pruebas para nuevo código.
- Documenta nuevas características.
- Mantén las funciones pequeñas y enfocadas.
- Usa nombres descriptivos para variables y funciones.

## 🧪 Pruebas

Asegúrate de que todas las pruebas pasan antes de enviar un PR:

```bash
npm test
```

Para ejecutar pruebas en modo watch:

```bash
npm test -- --watch
```

## ❓ Preguntas Frecuentes

### ¿Cómo puedo empezar a trabajar en un issue?

1. Comenta en el issue que te gustaría trabajar en él.
2. Espera la confirmación de un mantenedor.
3. Sigue los pasos de [Primeros Pasos](#primeros-pasos).

### ¿Qué hago si tengo problemas para configurar el entorno de desarrollo?

Abre un issue con la etiqueta `help wanted` describiendo los problemas que estás teniendo.

### ¿Cómo puedo mejorar la documentación?

La documentación es tan importante como el código. Si encuentras errores o mejoras, ¡no dudes en enviar un PR!

## 🙏 Agradecimientos

Gracias a todos los [contribuyentes](https://github.com/tu-usuario/los-sartenes/graphs/contributors) que han ayudado a mejorar este proyecto.

---

*Este documento está inspirado en el [Contributing Guide](https://github.com/atom/atom/blob/master/CONTRIBUTING.md) de Atom.*
