#!/bin/sh
FILES="dist/*"

lftp -u $FTP_USER,$FTP_PASSWORD $FTP_HOST <<END_SCRIPT
set ssl:verify-certificate no
mrm "*"
mput $FILES
exit
END_SCRIPT