export SOLR_EXAMPLE_PATH='/home/alok/work/lemonbag/solr/apache-solr-3.1.0/example'
export SUNSPOT='/home/alok/work/lemonbag/sangam'
cd $SOLR_EXAMPLE_PATH
java -Dsolr.solr.home=$SUNSPOT/solr -jar start.jar
