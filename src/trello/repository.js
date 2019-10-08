import map from 'lodash/map'

const fetchCards = t => doneColumns => Promise.all(doneColumns.map(column => t.get(`list/${column.id}/cards`)));
const fetchChangeListActions = t => cards => Promise.all(cards.map(card => t.get(`/cards/${card.id}/actions`, {filter: 'updateCard:idList'})));

export const filterDone = items => items.filter(item => item.name.indexOf('Done') === 0)
export const mergeFromDifferentLists = cardsByList => cardsByList.reduce((total, currentList) => [...total, ...currentList], []);
export const extractStartEndDate = cardsActions => cardsActions.map(cardActions => {
  return cardActions.reduce((dates, currentAction) => {
    if (currentAction.data.listAfter.name.indexOf('Done') === 0 && currentAction.data.listBefore.name.indexOf('Doing') === 0) {
      dates.completedAt = currentAction.date
    }
    if (currentAction.data.listAfter.name.indexOf('To do') === 0 ) {
      dates.startedAt = currentAction.date
    }

    dates.id = currentAction.data.card.id
    return dates
  }, {})
})

const daysDiff = (createdAt, completedAt) => {
  const MICROSECONDS_IN_ONE_DAY = 1000 * 3600 * 24;
  const createdAtDate = new Date(createdAt)
  const completedAtDate = new Date(completedAt)

  return (completedAtDate.getTime() - createdAtDate.getTime()) / MICROSECONDS_IN_ONE_DAY
}

export const calculateTimeToMarket = cards => map(cards, dates => ({
  ...dates,
  timeToMarket: daysDiff(dates.startedAt, dates.completedAt)
}))

export const sortByCompletedAt = cards => cards.sort((a, b) => {
    const d1 = new Date(a.completedAt)
    const d2 = new Date(b.completedAt)
    return d1.getTime() - d2.getTime()
  })

function repository(t) {
  const getTimeToMarket = () =>
    t.get(`boards/${process.env.REACT_APP_BOARD}/lists`, {fields: ['id', 'name']})
      .then(filterDone)
      .then(fetchCards(t))
      .then(mergeFromDifferentLists)
      .then(fetchChangeListActions(t))
      .then(extractStartEndDate)
      .then(calculateTimeToMarket)
      .then(sortByCompletedAt)
  return {
    getTimeToMarket
  }
}

export default repository

