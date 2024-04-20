const dropDownMenuBtn = $('.dropBtn');
const dropDownMenuItems = $('.dropDownItems');

export const dropDownMenu = () => {
  dropDownMenuBtn.on('click', function (e) {
    e.preventDefault();

    dropDownMenuItems.toggleClass('show');
  });
};
