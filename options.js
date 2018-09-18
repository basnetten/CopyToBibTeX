function save_options() {
  const newFormat = document.getElementById('format').value;
  chrome.storage.sync.set({"format": newFormat});
}

function restore_options() {
  chrome.storage.sync.get("format", function(obj)
  {
    if (obj.format !== null)
      document.getElementById('format').value = obj.format;
  });
}

function set_default()
{
  document.getElementById('format').value = "@online{site_...,\n  title = {{0}},\n  url = {{1}},\n  urldate = {{2}}\n}\n";
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('default').addEventListener('click', set_default);

/**
 * A simple logging function to make code more readable and to make
 * it easier to log data.
 *
 * @param  string str string to log.
 */
function log(str) {
  chrome.extension.getBackgroundPage().console.log(str);
}
