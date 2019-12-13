import * as Sentry from "@sentry/browser";
function init() {
  Sentry.init({
    dsn: "https://ffdcd4d7e8d844639a2c26ae9d2a1c27@sentry.io/1828826"
  });
}

function log(error) {
  //TODO: figure out why below line wont show ex on sentry.io
  //Sentry.captureException(error);
  console.error(error);
}

export default {
  init,
  log
};
