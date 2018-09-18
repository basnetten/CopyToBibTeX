/*
https://medium.freecodecamp.org/how-to-create-and-publish-a-chrome-extension-in-20-minutes-6dc8395d7153
https://developer.chrome.com/extensions/contextMenus
https://superuser.com/questions/179347/can-i-add-right-click-options-in-google-chrome
https://developer.chrome.com/extensions/tut_debugging
https://stackoverflow.com/questions/17535154/google-chrome-extension-background-script
https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
https://gist.github.com/srsudar/e9a41228f06f32f272a2
*/

function log(str) {
  chrome.extension.getBackgroundPage().console.log(str);
}

/**
 * Function which copies `str` to the users clipboard.
 *
 * https://gist.github.com/srsudar/e9a41228f06f32f272a2
 */
function copy(str) {
    var sandbox = $('#sandbox').val(str).select();
    document.execCommand('copy');
    sandbox.val('');
}

function createBibTexString(tabs){
  copy("@online{site_,\n" +
    "  title = {" + tabs[0].title + "},\n" +
    "  url = {" + tabs[0].url + "},\n" +
    "  urldate = {" + getDateString() + "}\n" +
    "}");
}

function getDateString() {
  return new Date().toJSON().slice(0,10).replace(/-/g,'-');
}

function getTab() {
  chrome.tabs.query({active: true, currentWindow: true}, createBibTexString);
}

chrome.contextMenus.create({title: "Copy page to BibTeX", visible: true, onclick: function() {
  getTab();
}});
