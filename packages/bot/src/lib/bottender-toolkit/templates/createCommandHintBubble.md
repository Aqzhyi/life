https://developers.line.biz/flex-simulator/?status=success

{
  "type": "carousel",
  "contents": [
    {
      "type": "bubble",
      "size": "micro",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "指令",
                "color": "#ffffff66",
                "size": "xxs"
              },
              {
                "type": "text",
                "text": "直播",
                "color": "#ffffff",
                "size": "md",
                "flex": 4,
                "weight": "bold"
              }
            ]
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "功能",
                "color": "#ffffff66",
                "size": "xxs"
              },
              {
                "type": "text",
                "text": "查詢流行遊戲",
                "color": "#ffffff",
                "size": "md",
                "flex": 4,
                "weight": "bold"
              }
            ]
          }
        ],
        "paddingAll": "20px",
        "backgroundColor": "#0367D3",
        "spacing": "md",
        "height": "154px",
        "paddingTop": "22px"
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "若在群組使用請加驚嘆號「！」",
            "size": "xxs",
            "color": "#bbbbbb",
            "wrap": true
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "button",
            "style": "primary",
            "height": "sm",
            "action": {
              "type": "message",
              "label": "指令",
              "text": "直播"
            }
          }
        ]
      }
    }
  ]
}
