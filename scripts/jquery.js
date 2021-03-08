//$( function() {
//    $( ".controlgroup" ).controlgroup()
//    $( ".controlgroup-vertical" ).controlgroup({
//      "direction": "vertical"
//    });
//  } );
// Synchronously read a text file from the web server with Ajax
//
// The filePath is relative to the web page folder.
// Example:   myStuff = loadFile("Chuuk_data.txt");
//
// You can also pass a full URL, like http://sealevel.info/Chuuk1_data.json, but there
// might be Access-Control-Allow-Origin issues. I found it works okay in Firefox, Edge,
// or Opera, and works in IE 11 if the server is configured properly, but in Chrome it only
// works if the domains exactly match (and note that "xyz.com" & "www.xyz.com" don't match).
// Otherwise Chrome reports an error:
//
//   No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://sealevel.info' is therefore not allowed access.
//
// That happens even when "Access-Control-Allow-Origin *" is configured in .htaccess,
// and even though I verified the headers returned (you can use a header-checker site like
// http://www.webconfs.com/http-header-check.php to check it). I think it's a Chrome bug.
function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  return result;
}


async function adisp(fn){
    await loadFile(fn);
}




function add_tab(label, disp_label, config, defaulttab, width, height){

    const data = "test.html";
    var alltabs = $('#alltabs');
    var tabhead = $('.tab');
    var fn = config.filenames[label];
    var div = '<div id="'+label+'", class="tabcontent">'+loadFile(fn)+'</div>';
    var onclick = "openTab(event, '"+label+"')";
    var button = '<button class="tablinks" onclick="'+onclick+'" '+defaulttab+'>'+disp_label+'</button>';
    alltabs.append(div);
    tabhead.append(button);
    $('#defaultTab').trigger('click');
    $('#defaultTab').addClass('active');
}


$(document).ready(function(){
    var txt = '';
    var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
    reader.open("GET", 'config.json', false);
    reader.onloadend = json_parse;
    reader.send();
    function json_parse(){
        var txt = JSON.parse(reader.responseText);
        return txt
    }
    var config = json_parse();
    var tabs_cfg = config.Tabs;
    var time = config.Time;
    $('.time-period').html(time);
    var table_data = loadFile('table.html');
    $('#table').html(table_data);
    for (i=0, l=tabs_cfg.entries.length; i < l; i++){
        var name = tabs_cfg.entries[i];
        var label = tabs_cfg.plotly_name[name];
        var id = '';
        if ( i == 0){
            var id = 'id="defaultTab"';
        }
        add_tab(name, label, tabs_cfg, id , 850, 750);
    }

});

