//var notebod = document.getElementById("post-noteplace");
var notebod = document.getElementsByClassName("ql-editor")[0];
var hiddenbody = document.getElementById("hiddenbody").innerHTML;
var hiddensummary = document.getElementById("hiddensummary").innerHTML;
var targetsumm = document.getElementById("summary-text-ar");

function decodeEntities(encodedString) {
  var textArea = document.createElement('textarea');
  textArea.innerHTML = encodedString;
  return textArea.value;
}

var a = decodeEntities(hiddenbody);
notebod.innerHTML = a;

targetsumm.value = hiddensummary;

function download(){
  $("#downloadbttt").trigger('click');
}
