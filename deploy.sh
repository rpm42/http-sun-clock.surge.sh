rm -rf ./dist
yarn build
cp CORS ./dist
surge ./dist sun-clock.surge.sh