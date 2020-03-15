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

7) Comprueba que puedes recolectar tweets:

```bash
    php php/run.php collect
```

## Screenshots

(will appear here)
