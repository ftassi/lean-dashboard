import {calculateTimeToMarket, extractStartEndDate, filterDone, mergeFromDifferentLists, sortByCompletedAt} from './repository'

describe('done', () => {
  it('should filter elements with name starting with Done', () => {
    const data = [
      {name: 'Done this'},
      {name: 'Doing'},
      {name: 'Done that'},
    ]

    expect(filterDone(data)).toStrictEqual([
      {name: 'Done this'},
      {name: 'Done that'},
    ]);
  })
})

describe('mergeFromDifferentList', () => {
  it('should merge cards from different lists in a single array', () => {
    const lists = [
      [{id: 'card1'}, {id: 'card2'}],
      [{id: 'card3'}],
      [{id: 'card4'}, {id: 'card5'}],
    ]

    expect(mergeFromDifferentLists(lists)).toStrictEqual([{id: 'card1'}, {id: 'card2'}, {id: 'card3'}, {id: 'card4'}, {id: 'card5'}])
  })
})

describe('extractStartEndDate', () => {
  it('should extrapolate starting and ending dates from actions', () => {
    const today = '2019-09-02T09:54:39.945Z';
    const yesterday = '2019-09-01T09:54:39.945Z';
    const card1Actions = [
      {data: {card: {id: 'card1'}, listBefore: {name: 'Doing'}, listAfter: {name: 'Done'}}, date: today},
      {data: {card: {id: 'card1'}, listBefore: {name: 'Ideas'}, listAfter: {name: 'To do'}}, date: yesterday},
    ];

    expect(extractStartEndDate([card1Actions])).toStrictEqual(
      [{id: 'card1', startedAt: yesterday, completedAt: today}]
    )
  })
})

describe('calculate time to market', () => {
  it('should express time to market in days between startedAt and completedAt', () => {
    const today = '2019-09-02T09:54:39.945Z';
    const yesterday = '2019-09-01T09:54:39.945Z';

    const _4daysAgo = '2019-01-20T09:54:39.945Z'
    const _6daysAgo = '2019-01-18T09:54:39.945Z'

    const cards = [
      {id: 'card1', startedAt: yesterday, completedAt: today},
      {id: 'card2', startedAt: _6daysAgo, completedAt: _4daysAgo},
    ]
    expect(calculateTimeToMarket(cards)).toStrictEqual([
      {id: 'card1', startedAt: yesterday, completedAt: today, timeToMarket: 1},
      {id: 'card2', startedAt: _6daysAgo, completedAt: _4daysAgo, timeToMarket: 2},
    ])
  })
})

describe('sort by completed at', () => {
  it('should sort by completed at desc', () => {

    const cards = [
      {completedAt: "2019-09-02T09:54:39.945Z", id: "5cbec2c2a64ebb488d7fcb66", startedAt: "2019-05-13T18:05:49.609Z", timeToMarket: 111.65891592592592},
      {completedAt: "2019-09-18T09:02:23.159Z", id: "5d47d3ddbfd9705558583bb2", startedAt: "2019-09-12T08:00:08.538Z", timeToMarket: 6.043224780092593},
      {completedAt: "2019-09-18T11:12:56.503Z", id: "5d79fa2780a48628780871e3", startedAt: "2019-09-17T12:49:00.539Z", timeToMarket: 0.9332866203703704},
      {id: "5d42b23d7f3dbc55011bfe0e", completedAt: "2019-08-09T08:41:58.785Z", startedAt: "2019-08-09T08:30:18.700Z", timeToMarket: 0.008102835648148149},
      {id: "5c3e004ecbdb49319cf35d79", completedAt: "2019-08-07T10:15:15.189Z", startedAt: "2019-02-19T10:40:30.818Z", timeToMarket: 168.98245799768517},
      {completedAt: "2019-08-06T15:14:33.441Z", id: "5cd14ce095b4cc062c5592ee", startedAt: "2019-07-02T13:37:22.527Z", timeToMarket: 35.06748743055556},
    ]

    expect(sortByCompletedAt(cards)).toStrictEqual([
      {completedAt: "2019-08-06T15:14:33.441Z", id: "5cd14ce095b4cc062c5592ee", startedAt: "2019-07-02T13:37:22.527Z", timeToMarket: 35.06748743055556},
      {id: "5c3e004ecbdb49319cf35d79", completedAt: "2019-08-07T10:15:15.189Z", startedAt: "2019-02-19T10:40:30.818Z", timeToMarket: 168.98245799768517},
      {id: "5d42b23d7f3dbc55011bfe0e", completedAt: "2019-08-09T08:41:58.785Z", startedAt: "2019-08-09T08:30:18.700Z", timeToMarket: 0.008102835648148149},
      {completedAt: "2019-09-02T09:54:39.945Z", id: "5cbec2c2a64ebb488d7fcb66", startedAt: "2019-05-13T18:05:49.609Z", timeToMarket: 111.65891592592592},
      {completedAt: "2019-09-18T09:02:23.159Z", id: "5d47d3ddbfd9705558583bb2", startedAt: "2019-09-12T08:00:08.538Z", timeToMarket: 6.043224780092593},
      {completedAt: "2019-09-18T11:12:56.503Z", id: "5d79fa2780a48628780871e3", startedAt: "2019-09-17T12:49:00.539Z", timeToMarket: 0.9332866203703704},
    ])
  })
});
