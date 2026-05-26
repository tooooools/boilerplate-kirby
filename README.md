# Boilerplate-kirby
> Opinionated boilerplate for Kirby 4, built on top of [`kirby-vite-multi-page-kit`](https://github.com/arnoson/kirby-vite-multi-page-kit/tree/main)

## Requirements

- [Composer](https://formulae.brew.sh/formula/composer)
- [Node >= 18](https://nodejs.org/en/download/package-manager)
- PHP >= 8.3.0

## Installation

[Use this template](https://github.com/chevalvert/boilerplate-kirby/generate).

```console
$ composer install
$ yarn install
```

## Usage

```console
$ yarn start
$ composer update getkirby/cms
```

### Deployment

Deployment is done automatically via a [Github action](.github/workflows/release.yml). Simply create a new release by running:
```console
$ yarn version
```

#### First deployment

##### Setup workflow variables

Go to your [repo settings](settings/secrets/actions) and create the necessary variables and secrets for the release workflow:

```bash
variables / 
  FTP_SERVER
  REMOTE_DIR

secrets / 
  FTP_USERNAME
  FTP_PASSWORD
```

##### Manual transfer

Some directories are not under version control. Deployment for those directories should be done manually.

```
├── content
├── kirby
├── site
│ └── plugins/*
├── storage
└── vendor
```

##### Troubleshooting

If you encounter a bug `Error: Client is closed because read ECONNRESET (data socket)`, create an empty `.ftp-deploy-sync-state.json` to the root folder you try to publish to.

## Server requirements 

###### `php.ini`

```
extension=php_intl.dll
extension=intl
```

###### Root directory 

```
Root directory: www/public/
```

## Versioning

Because this is a boilerplate and not a library it doesn’t use semantic versioning.

## Credits

Built on top of **[kirby-vite-multi-page-kit](https://github.com/arnoson/kirby-vite-multi-page-kit/tree/main)**.

## License
[MIT.](https://tldrlegal.com/license/mit-license)
