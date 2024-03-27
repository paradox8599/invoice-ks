#!/bin/sh
DB_URL=$(echo "$DATABASE_URL" | cut -d "?" -f 1)
while true; do
	echo "[backup] backup on $(date)"
	fn=pgdump-$(date +%F-%H-%M-%S).sql
	echo "[backup] pulling db to $fn"
	pg_dump "$DB_URL" >"$fn"
	echo "[backup] uploading backup"
	aws s3 cp "$fn" "s3://$AWS_BUCKET/sql/$fn"
	echo "[backup] clean up"
	rm -f "$fn"
	echo "[backup] done, waiting for next backup"
	sleep "$((60 * 60 * 24))"
done &

npm run start:ks

kill 0
