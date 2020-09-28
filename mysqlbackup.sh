#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
COUNT=$(ls -1q 2>/dev/null $DIR*gpg | wc -l)
if [ $COUNT -ne 0]
then
  rm $DIR"/*.gpg"
fi
OUTPUT=$DIR"/"$1.sql
ENC=$OUTPUT.gpg
mysqldump --user=root --password=Example $1 > $OUTPUT
gpg -c --batch --passphrase=$2 $OUTPUT
rm $OUTPUT
