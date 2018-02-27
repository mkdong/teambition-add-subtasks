/* From stackoverflow */
var s = document.createElement('script');
s.id = 'subtask-injected-script';
s.src = chrome.extension.getURL('injected.js');
s.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
