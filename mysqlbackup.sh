#!/bin/bash

OUTPUT=$1.sql
ENC=$OUTPUT.gpg
mysqldump --user=root --password=youwonder. $1 > $OUTPUT
gpg -c --batch --passphrase=$2 $OUTPUT
rm $OUTPUT
