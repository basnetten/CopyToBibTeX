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

createFunctionStringFormat();

chrome.contextMenus.create({title: "Copy page to BibTeX", visible: true, onclick: function() {
  const cb = function(){
    // As this callback is called when the title and url are set,
    // handle the copying here. Outside this function we do not
    // know whether or not the title and url are set.
    copy(getBibTexString());
  }

  // Get the data.
  fillDateData();
  // Get the title and URL.
  fillTitleAndUrlData(cb);
  fillFormat(cb);
}});

const data = {
  url: null,
  title: null,
  date: null
};

let format = null;

/**
 * Retrieve and set the date in the `data` object.
 */
function fillDateData(){
  data.date = getDateString();
}

/**
 * Retrieve the title and url from the current page. As this is
 * an async operation, a callback needs to be provided which gets
 * called after the title and url are set in the `data` object.
 *
 * @param  {Function} callback Is called after the title and url are set.
 */
function fillTitleAndUrlData(callback){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    data.url    = tabs[0].url;
    data.title  = tabs[0].title;

    if (format !== null)
      callback();
  });
}

/**
 * Retrieve the format from storage.
 *
 * @param  {Function} callback Is called when all data is available.
 */
function fillFormat(callback) {
  chrome.storage.sync.get("format", function(obj)
  {
    if (obj.format !== undefined) {
      format = obj.format;
    } else {
      format = "@online{site_...,\n  title = {{0}},\n  url = {{1}},\n  urldate = {{2}}\n}\n";
      chrome.storage.sync.set({"format": format});
    }

    if (data.title !== null)
      callback();
  });
}

/**
 * Fills the format with data and returns the result.
 * Also sets the format to null.
 *
 * @return string A string based on `format` with data from `data`.
 */
function getBibTexString() {
  const str = String.format(format, data.title, data.url, data.date);

  format = null;

  return str;
}

/**
 * Function which copies `str` to the users clipboard. It uses the
 * `sandbox` textarea to achieve this. First, the string is put into
 * the hidden textarea, and then the contents of the textarea are
 * copied into the user's clipboard.
 *
 * https://gist.github.com/srsudar/e9a41228f06f32f272a2
 */
function copy(str) {
    const sandbox = $('#sandbox').val(str).select();
    document.execCommand('copy');
    sandbox.val('');
}

/**
 * Returns a string of the date today in format yyyy-mm-dd.
 * https://stackoverflow.com/a/19079030
 *
 * @return string Date of today in format yyyy-mm-dd.
 */
function getDateString() {
  return new Date().toJSON().slice(0,10).replace(/-/g,'-');
}

/**
 * Create a new function in the String class to format like printf.
 *
 * https://stackoverflow.com/a/4673436
 */
function createFunctionStringFormat(){
  if (!String.format) {
    String.format = function(format) {
      var args = Array.prototype.slice.call(arguments, 1);
      return format.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
        ;
      });
    };
  }
}

/**
 * A simple logging function to make code more readable and to make
 * it easier to log data.
 *
 * @param  string str string to log.
 */
function log(str) {
  chrome.extension.getBackgroundPage().console.log(str);
}
