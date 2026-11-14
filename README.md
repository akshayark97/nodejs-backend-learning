# Docker👇
## View database logs
docker compose logs -f postgres

## Stop PostgreSQL
docker compose stop postgres

## Start it again
docker compose start postgres

### Note:
Don't run docker compose down -v unless you intentionally want to delete the database volume and its data.