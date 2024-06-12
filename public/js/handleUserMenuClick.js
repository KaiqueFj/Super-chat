const settingGearButton = $('.menuItem.settings');
const ContainerWithUserInformations = $('.configurationsMenu');
const returnBtn = $('.settingsBtn');
const OpenContainerUpdateUserBtn = $('.settingsBtn.edit-user-info');
const ContainerToUpdateUser = $('.updateUserContainer');
const OpenChatBackgroundForm = $('.listUserItems.backgroundImg');
const chatBackgroundUpdateForm = $('.updateUserContainer.chat');
const OpenChangePasswordForm = $('.listUserItems.changePassword');
const userContainerPasswordChange = $('.updateUserContainer.password');

export const settingsMenu = () => {
  settingGearButton.on('click', function (e) {
    e.preventDefault();

    ContainerWithUserInformations.toggleClass('show');
  });

  //return to previous container
  returnBtn.on('click', function (e) {
    e.preventDefault();
    ContainerWithUserInformations.toggleClass('show');
    ContainerToUpdateUser.removeClass('show');
  });

  // Open the container to update the background
  OpenChatBackgroundForm.on('click', function (e) {
    e.preventDefault();
    chatBackgroundUpdateForm.toggleClass('show');
    ContainerWithUserInformations.toggleClass('show');
  });

  // Open the container to update the userInfo
  OpenContainerUpdateUserBtn.on('click', function (e) {
    e.preventDefault();
    ContainerToUpdateUser.toggleClass('show');
    chatBackgroundUpdateForm.toggleClass('show');
    userContainerPasswordChange.toggleClass('show');
  });

  OpenChangePasswordForm.on('click', function (e) {
    e.preventDefault();
    userContainerPasswordChange.toggleClass('show');
    ContainerWithUserInformations.toggleClass('show');
  });
};
