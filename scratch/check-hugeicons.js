const hugeicons = require('hugeicons-react');
const icons = [
  'SparklesIcon', 'Compass01Icon', 'Note01Icon', 'ViewIcon', 'Activity01Icon', 'BotIcon', 'PackageIcon', 'KeyboardIcon', 'RocketIcon', 'CompassIcon', 'NoteIcon', 'ActivityIcon', 'ChartBar01Icon', 'ChartBarIcon'
];

icons.forEach(i => {
  if (hugeicons[i]) {
    console.log(`Found: ${i}`);
  } else {
    console.log(`Missing: ${i}`);
  }
});
