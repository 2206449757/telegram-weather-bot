// stateManager.js
module.exports = {
  getUserState,
  setUserState,
  resetUserState,
  ensureUserState,
};
const Parse = require('parse/node');

Parse.initialize(
  process.env.BACK4APP_APP_ID,
  process.env.BACK4APP_JAVASCRIPT_KEY
);

Parse.serverURL = '<https://parseapi.back4app.com/>';

const UserState = Parse.Object.extend('UserState');

async function getUserState(userId) {
  const query = new Parse.Query(UserState);
  query.equalTo('userId', userId.toString());
  const userState = await query.first();
  return userState ? userState.get('state') : null;
}
async function setUserState(userId, state) {
  const query = new Parse.Query(UserState);
  query.equalTo('userId', userId.toString());
  let userState = await query.first();

  if (!userState) {
    userState = new UserState();
    userState.set('userId', userId.toString());
  }

  userState.set('state', state);
  await userState.save();
}
async function resetUserState(userId) {
  await setUserState(userId, {});
}
async function ensureUserState(userId) {
  let state = await getUserState(userId);
  if (!state) {
    await setUserState(userId, {});
  }
}