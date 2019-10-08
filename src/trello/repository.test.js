import {calculateTimeToMarket, extractStartEndDate, filterDone, mergeFromDifferentLists} from './repository'

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
      {data: {card: {id: 'card1'}, listBefore: {name: 'To do '}, listAfter: {name: 'Doing'}}, date: yesterday},
    ];

    expect(extractStartEndDate([card1Actions])).toStrictEqual({card1: {startedAt: yesterday, completedAt: today}})
  })
})

describe('calculate time to market', () => {
  it('should express time to market in days between startedAt and completedAt', () => {
    const today = '2019-09-02T09:54:39.945Z';
    const yesterday = '2019-09-01T09:54:39.945Z';
    const cards = {card1: {startedAt: yesterday, completedAt: today}}

    expect(calculateTimeToMarket(cards)).toStrictEqual({card1: {startedAt: yesterday, completedAt: today, timeToMarket: 1}})
  })
})
