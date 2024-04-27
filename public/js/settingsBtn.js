const settingsDiv = $('.menuItem.settings');
const settingsMenuDiv = $('.configurationsMenu');
const settingsBtn = $('.settingsBtn');

export const settingsMenu = () => {
  settingsDiv.on('click', function (e) {
    e.preventDefault();

    console.log('clicked');

    settingsMenuDiv.toggleClass('show');
  });

  settingsBtn.on('click', function (e) {
    e.preventDefault();

    settingsMenuDiv.toggleClass('show');
  });
};
