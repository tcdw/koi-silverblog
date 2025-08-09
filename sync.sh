#!/usr/bin/env bash

pnpm run build
rsync -av --progress --delete-after --exclude node_modules . tcdw@tcdw.host.reall.bond:/home/tcdw/apps/SilverBlog/templates/koi
curl -X DELETE https://www.tcdw.net/cache/