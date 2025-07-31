#!/bin/bash
cd /var/www/marchabrasil
pm2 restart marchabrasil
pm2 logs marchabrasil --lines 20