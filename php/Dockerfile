FROM php:7.4.3-cli-alpine3.10

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

ENV APP /opt/app
WORKDIR $APP

COPY composer.json $APP
RUN composer install

COPY . .
ENTRYPOINT ["php", "run.php"]
