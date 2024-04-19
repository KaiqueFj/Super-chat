const dropDownMenuBtn = $('.dropBtn');
const dropDownMenuItems = $('.dropDownItems');

export const dropDownMenu = () => {
  dropDownMenuBtn.on('click', function (e) {
    e.preventDefault();

    dropDownMenuItems.toggleClass('show');

    const dropdownBtnPos = $(this).offset();
    const dropdownBtnHeight = $(this).outerHeight();

    dropDownMenuItems.css({
      top: dropdownBtnPos.top + dropdownBtnHeight - 70,
      left: dropdownBtnPos.left,
    });
  });
};
