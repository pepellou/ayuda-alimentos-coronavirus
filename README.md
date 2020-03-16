# ayuda-alimentos-coronavirus

Lista + mapa que muestra los tweets con el hashtag #AyudaAlimentosCoronavirus

Míralo en acción en [https://pepellou.github.io/ayuda-alimentos-coronavirus/](https://pepellou.github.io/ayuda-alimentos-coronavirus/)


## Cómo contribuir

- Puedes aportar feedback dirigiéndote a [@pepellou en Twitter](https://twitter.com/pepellou)
- Explora [la lista de issues](https://github.com/pepellou/ayuda-alimentos-coronavirus/issues) y deja comentarios en ellas, o haz PRs que las resuelvan


## Instalación local

0) Clona este repositorio (deberías saber cómo :grimacing:)

1) Crea el archivo de configuración copiando de config.php.ini:

```bash
    cd php
    cp config.php.ini config.php
```

2) Edita dicho archivo de configuración config.php reemplazando todos los `FILL_ME` por los valores adecuados.

(pídeme los datos [por DM en Twitter](https://twitter.com/messages/compose?recipient_id=133220267))

3) Actualiza las dependencias:

```bash
    cd php
    composer install
```

4) Comprueba que puedes consultar los últimos tweets:

```bash
    php php/run.php last
```

5) Configura firebase copiando el archivo firebase-credentials.json.ini:

```bash
    cd php
    cp firebase-credentials.json.ini firebase-credentials.json
```

6) Edita el archivo firebase-credentials.json reemplazando todos los `FILL_ME` por los valores adecuados.

(pídeme los datos [por DM en Twitter](https://twitter.com/messages/compose?recipient_id=133220267))

7) Comprueba que puedes recolectar tweets:

```bash
    php php/run.php collect
```

## Instalación local con Docker

### Requisitos

- docker 19+
- docker-compose 1.25+
- Configurar `php/config.php` y `php/firebase-credentials.json` como se especifica en la sección anterior

### Comandos

- Construir/descargar las imágenes necesarias:
  ```
  docker-compose pull
  docker-compose build
  ```
- Arrancar la web (sólo html):
  ```
  docker-compose up app
  ```

  La web está accesible en: `http://localhost:3000`

- Ejecutar comandos del backend:
  ```
  docker-compose run --rm backend <COMANDO>
  ```
  Ejemplo:
  ```
  docker-compose run --rm backend db
  docker-compose run --rm backend last
  docker-compose run --rm backend collect
  ```
- Limpiar containers, volúmenes e imágenes:
  ```
  docker-compose down --rmi local --volumes
  ```

## Capturas de pantalla

![Listado filtrable](/img/screenshots/list.png)

![Mapa](/img/screenshots/map.png)

![Mostrar últimos](/img/screenshots/show_last.png)

### Iconos utilizados

[SOS Emergency by Hali Gali Harun from the Noun Project](https://thenounproject.com/search/?q=sos&i=457451)

[give love by Justin Blake from the Noun Project](https://thenounproject.com/search/?q=hand%20heart&i=865924)
