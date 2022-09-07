# Backoffice Wallet Link

Contains useful helpers to link our backoffice with wallet capabilities

## Publish npm package

Ensure you are on the `main` branch and create a new patch version.
_Could be either a patch, minor or major upgrade_

```bash
git checkout main
yarn version --patch
git push origin HEAD --tags
```

## Use the published package as a CDN import

Let's say you just pushed a new tag called `v0.1.0`.
You can get your built script on [https://unpkg.com/lead-contributor-back-office@v0.1.0/dist/main.js](https://unpkg.com/lead-contributor-back-office@v0.1.0/dist/main.js)
