<script type="text/javascript" src="http://platform.linkedin.com/in.js">
  api_key: g0l32ovkc3vr
  onLoad: onLinkedInLoad
  authorize: true
</script>
  function onLinkedInLoad() {
 
    IN.API.Profile("me").fields(["firstName","lastName","twitterAccounts","connections", "location", "industry", "numConnections", "summary", "specialties",  "honors", "interests", "positions", "educations", "languages","skills", "numRecommenders", "pictureUrl", "publicProfileUrl" ]).result(function(result) {
                                                    alert (JSON.stringify(result));
                                                  });

    IN.API.Connections("me").result(function(result) {
                                                        alert (JSON.stringify(result));
                                                    });

    IN.API.MemberUpdates("me").params({"type":["SHAR","STAT","VIRL"]}).result(function(result) { 
                                                                                                  alert (JSON.stringify(result));
                                                                                               });

    http://api.linkedin.com/v1/people/~/connections
    http://api.linkedin.com/v1/people/~
    oauth_token=

  }
