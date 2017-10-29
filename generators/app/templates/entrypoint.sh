#!/usr/bin/env bash

CMD=$1

echo "Command :" $CMD

JAVA_OPTS="$JAVA_OPTS -Duser.timezone=America/Los_Angeles -Dspring.profiles.active=default,$PROFILE -Dhttps.protocols=TLSv1.1,TLSv1.2 -Djava.security.egd=file:/dev/./urandom"

case "$CMD" in
    "start")
        echo "Starting SpringBoot application"
        exec java $JAVA_OPTS -jar /app.jar
    ;;

    * )
        # custom command
        exec $CMD ${@:2}
    ;;
esac