# MusicMania 🎵

Plataforma web para la consulta, gestión y reseña de álbumes de música con carrito de compras integrado.

## 🚀 Características principales

* **Catálogo Dinámico:** Carga de productos desde base de datos MySQL mediante AJAX/Fetch API.
* **Carrito de Compras:** Gestión en tiempo real utilizando `localStorage` para persistencia en el navegador.
* **Sistema de Reseñas:** Formulario para agregar y guardar valoraciones de discos en la base de datos.
* **Base de Datos Autogenerada:** El backend verifica e inicializa la base de datos y tablas de forma automática en la primera ejecución.

---

## 🛠️ Tecnologías utilizadas

* **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.
* **Backend:** PHP.
* **Base de Datos:** MySQL.
* **Servidor Local:** XAMPP / Apache.

---

## ⚙️ Requisitos e Instalación

### 1. Clonar o descargar el repositorio
Ubica los archivos del proyecto dentro del directorio de tu servidor local:
`C:\xampp\htdocs\Musicmania`

### 2. Configuración de XAMPP / MySQL
1. Inicia los servicios de **Apache** y **MySQL** desde el Control Panel de XAMPP.Ingresar a panel principal, mysql a la derecha. config
   e ingresar a my.ini (se abre a travez de bloc de notas)y cambiar los puertos a 3307
   
3. Si tu MySQL utiliza el puerto personalizado `3307`, asegúrate de que el archivo `php/conexion.php` mantenga la configuración correspondiente:
   ```php
   $host = "127.0.0.1";
   $usuario = "root";
   $clave = "";
   $bd = "MusicMania";
   $puerto = 3307;
