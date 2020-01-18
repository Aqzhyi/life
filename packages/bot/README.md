[![](https://img.shields.io/badge/CHANGELOG-conventional%20changelog-informational)](./CHANGELOG.md)

# 讓你輕鬆查詢 Twitch 正在直播的 LINE BOT 機器人

> https://www.notion.so/hilezi/d7ac6acf3ee94029a245be3df3c9f5fe

---

- [讓你輕鬆查詢 Twitch 正在直播的 LINE BOT 機器人](#讓你輕鬆查詢-twitch-正在直播的-line-bot-機器人)
  - [加入好友](#加入好友)
- [BOT](#bot)
  - [development](#development)
  - [deploy](#deploy)
- [WEB](#web)

---

<img src="./public/2020-01-18-07-46-41.png" height="480" />

## 加入好友

| 正式站機器人 | 公開測試機器人 |
| ---------- | ------------ |
| <img src="./public/正式站機器人.png" /> | <img src="./public/公開測試機器人.png" /> |

# BOT

## development

> 需要兩個 process 一個給 webpack build，一個使用 bottender console 作測試。

```sh
npm run dev:watch
```

```sh
npm run dev:console
```

## deploy

```sh
# 部署到公開測試機器人
npm run deploy
```

```sh
# 部署到正式站
npm run deploy:prod
```

# WEB

```sh
now dev
```
