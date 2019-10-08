import mapValues from 'lodash/mapValues'

const fetchCards = t => doneColumns => Promise.all(doneColumns.map(column => t.get(`list/${column.id}/cards`)));
const fetchChangeListActions = t => cards => Promise.all(cards.map(card => t.get(`/cards/${card.id}/actions`, {filter: 'updateCard:idList'})));

export const filterDone = items => items.filter(item => item.name.indexOf('Done') === 0)
export const mergeFromDifferentLists = cardsByList => cardsByList.reduce((total, currentList) => [...total, ...currentList], []);
export const extractStartEndDate = cardsActions => cardsActions.reduce((cardDates, cardActions) => {
  cardDates[cardActions[0].data.card.id] = cardActions.reduce((dates, currentAction) => {
    if (currentAction.data.listAfter.name.indexOf('Done') === 0 && currentAction.data.listBefore.name.indexOf('Doing') === 0) {
      dates.completedAt = currentAction.date
    }
    if (currentAction.data.listAfter.name.indexOf('Doing') === 0 && currentAction.data.listBefore.name.indexOf('To do') === 0) {
      dates.startedAt = currentAction.date
    }

    return dates
  }, {})

  return cardDates
}, {})

const daysDiff = (createdAt, completedAt) => {
  const MICROSECONDS_IN_ONE_DAY = 1000 * 3600 * 24;
  const createdAtDate = new Date(createdAt)
  const completedAtDate = new Date(completedAt)

  return (completedAtDate.getTime() - createdAtDate.getTime()) / MICROSECONDS_IN_ONE_DAY
}

export const calculateTimeToMarket = cards => mapValues(cards, dates => ({...dates, timeToMarket: daysDiff(dates.startedAt, dates.completedAt)}))

function repository(t) {
  const getTimeToMarket = () =>
    t.get(`boards/${process.env.REACT_APP_BOARD}/lists`, {fields: ['id', 'name']})
      .then(filterDone)
      .then(fetchCards(t))
      .then(mergeFromDifferentLists)
      .then(fetchChangeListActions(t))
      .then(extractStartEndDate)
      .then(calculateTimeToMarket)
  return {
    getTimeToMarket: getTimeToMarket
  }
}

export default repository

