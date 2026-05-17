import * as hugeicons from 'hugeicons-react';
const icons = [
  'SparklesIcon', 'CompassIcon', 'Compass01Icon', 'Note01Icon', 'ViewIcon', 'Activity01Icon', 'ActivityIcon', 'BotIcon', 'PackageIcon', 'KeyboardIcon', 'RocketIcon', 'StarIcon'
];

icons.forEach(i => {
  if (hugeicons[i]) {
    console.log(`Found: ${i}`);
  } else {
    console.log(`Missing: ${i}`);
  }
});
