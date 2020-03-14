# ayuda-alimentos-coronavirus

Map to show tweets under the #AyudaAlimentosCoronavirus hashtag

## Quick start

0) Clone this repo (you should know how :grimacing:)

1) Set up your config file by copying it from config.php.ini:

```bash
    cd php
    cp config.php.ini config.php
```

2) Edit the config.php file and replace all `FILL_ME` values with the appropriate values.

3) Update project dependencies:

```bash
    cd php
    composer install
```

4) See last tweets:

```bash
    php php/run.php last
```

5) Set up your firebase config file by copying it from firebase-credentials.json.ini:

```bash
    cd php
    cp firebase-credentials.json.ini firebase-credentials.json
```

6) Edit the firebase-credentials.json file and replace all `FILL_ME` values with the appropriate values.

7) Collect some tweets:

```bash
    php php/run.php collect
```

## Screenshots

(will appear here)
