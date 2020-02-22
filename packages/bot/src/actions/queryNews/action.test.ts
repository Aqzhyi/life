import { queryNewsAction } from './action'
import { ContextMock } from '@/lib/bottender-toolkit/classes/ContextMock'
import { newsAPI } from '@/lib/news/newsAPI'

newsAPI.crawlAll = jest.fn()
newsAPI.getList = jest.fn().mockResolvedValue([
  {
    tag: ['anthem 更新'],
    _id: '5e511c69c5ada18d1bd93ed1',
    newsId: '399841af-1792-54a8-902e-a1580fa3cdc0',
    title: '《絕地求生》 6.2 更新上線！全新 8v8 團戰與澳洲火災援助計畫公開！',
    coverUrl: 'https://i.gbc.tw/gb_img/s200x112c/3984341.jpg',
    linkUrl: 'https://www.gamebase.com.tw/news/topic/99283762/',
    postedAt: '2020-02-18T21:35:45.000Z',
    provider: 'Gamebase',
  },
])

describe(queryNewsAction.name, () => {
  it('接受「更新」參數', async done => {
    const context = new ContextMock('新聞魔獸 更新').lineContext
    await queryNewsAction(context, { match: { groups: { keyword: '魔獸' } } })
    expect(newsAPI.crawlAll).toBeCalledTimes(1)
    expect(context.sendFlex).toBeCalledTimes(1)
    done()
  }, 10000)
})
