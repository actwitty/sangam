openssl genrsa -des3 -out site.key 2048
mv site.key site.orig.key
openssl rsa -in site.orig.key -out site.key
openssl req -new -key site.key -out site.csr
openssl x509 -req -days 365 -in site.csr -signkey site.key -out final.crt
