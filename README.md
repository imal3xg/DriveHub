# DRIVEHUB

Este repositorio contiene el programa entregado como Trabajo de fin de Trimestre para el curso de Acceso a Datos. DRIVEHUB es una aplicación que permite a los usuarios publicar anuncios de coches y ver los anuncios creados por otros usuarios.

## Características

- **Autenticación**: Incluye páginas de login y registro donde los usuarios pueden iniciar sesión o crear una cuenta.
- **Registro seguro**: Para registrarse, se solicita nombre, apellidos, nombre de usuario, correo electrónico y una contraseña con requisitos mínimos de seguridad.
- **Página de Bienvenida**: Muestra un saludo al usuario durante la carga inicial antes de redirigirlo a la página principal.
- **Exploración de Anuncios**: Los usuarios pueden ver todos los anuncios ordenados por fecha de creación, con los más recientes primero.
- **Gestión de Anuncios Propios**: Permite a los usuarios ver, crear, modificar y eliminar sus propios anuncios.
- **Preguntas Frecuentes**: Utiliza menús desplegables para proporcionar respuestas a preguntas comunes.
- **Acerca de**: Proporciona información sobre el creador del programa y enlaces a su GitHub y LinkedIn.
- **Carga de Imágenes**: Los usuarios pueden seleccionar imágenes desde su ordenador para usar como foto en sus anuncios, con el uso de Blob.

## Tecnologías Utilizadas

- **Angular Directivas**: Se hace uso de ngIf, ngFor y ngContainter.
- **Angular Pipes**: Se emplean pipes como translate, uppercase y se crea un pipe personalizado para transformar el formato de fecha del coche.
- **Guardas**: Se implementa una guarda para la seguridad de la aplicación.
