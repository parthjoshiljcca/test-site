FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
COPY nihongo/ /usr/share/nginx/html/nihongo/
EXPOSE 80
