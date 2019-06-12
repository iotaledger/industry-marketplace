# Deployment

## Configuration

To configure the `api` you should copy `./src/data/config.template.json` to `./src/data/config.dev.json` and modify the content.

```js
{
    "zmq": {                                        /* ZMQ Configuration */
        "endpoint": "ZMQ-ENDPOINT"                  /* IRI Node ZMQ Endpoint */
    }
}
```

## Build

```shell
npm run build
```

## Deploy

The `api` package is setup to be deployed to zeit/now, you should modify the config in `./now.json` to suit your own requirements and then execute the following.

If you want to use a different name for the config file you can specify an environment variable of CONFIG_ID, e.g. set CONFIG_ID to `dev` will load `config.dev.json` instead.

```shell
now
```