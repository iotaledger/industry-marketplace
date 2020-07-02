# IOTA MarketManager

### Pre-requisites

```shell
yarn
```

### Development

This will run the api at <http://localhost:5000>

```shell
yarn start-dev
```


# Deploy to Google Cloud

1. Install `gcloud`
https://cloud.google.com/sdk/docs/downloads-versioned-archives

2. Extract the contents of the file to any location on your file system

3. Go to folder and run the script:
`./google-cloud-sdk/install.sh`

4. Run following commands
```
gcloud components update

./bin/gcloud init
```
Select current project from the list. Select `semarket-iota`
Select region. Select `europe-west-4a` 

5. Navigate to the folder whese server code resides

6. Check `app.yaml` to make sure the project name matches the value of `service` attribute

7. Adjust Dockerfile if needed

8. Run deploy command
`gcloud app deploy --project semarket-iota`

9. Copy the deployed service URL and insert it into client `config.json` and `package.json`

10. Deploy client, make sure the the project name matches the value of `name` attribute in `now.json`