FROM nginx:alpine

# Copiar todos los archivos estáticos al directorio de Nginx
COPY . /usr/share/nginx/html

# Configurar Nginx para escuchar en el puerto 3000
RUN sed -i 's/listen\(.*\)80;/listen 3000;/g' /etc/nginx/conf.d/default.conf

# Exponer el puerto 3000
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

