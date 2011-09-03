heroku_app=$1
heroku config:add LOG_LEVEL=DEBUG --app $heroku_app 

if [ "$2" = "worker" ]
then
  heroku workers 1 --app $heroku_app
fi
