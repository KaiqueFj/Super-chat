import { dropDownMenuBtn, dropDownMenuItems } from './domElements.js';

export const dropDownMenu = () => {
  dropDownMenuBtn.on('click', function (e) {
    e.preventDefault();

    dropDownMenuItems.toggleClass('show');
  });
};
