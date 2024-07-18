import {
  dropDownMenuBtn,
  dropDownMenuItems,
} from '../handleInteration/domElements.js';

export const dropDownMenu = () => {
  dropDownMenuBtn.on('click', function (e) {
    e.preventDefault();

    dropDownMenuItems.toggleClass('show');
  });
};
