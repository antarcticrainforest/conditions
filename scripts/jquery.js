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


function get_title(expcomp, id){
    var expnames = expcomp.split('-');
    if (expnames.length > 1){
        $(id).html(expnames[0]+' - '+expnames[1]);
    }else {
        $(id).html(expnames[0]);
    }
}

function get_expdesc(expcomp, config, id){
    var expnames = expcomp.split('-');
    var overview = '';
    for (let i = 0, l = expnames.length; i < l; i += 1) {
        if (expnames[i] == 'ceres'){
            var exp_desc = 'FLASHFlux Gridded Fluxes';
        }else {
            var exp_desc = config.overview[expnames[i]];
        }
        var br = '';
        if (i < l - 1 && expnames.length > 1){
            var br = '<br>';

        }
        overview = overview + "<em>"+expnames[i]+"</em>: "+exp_desc+br
    }
    overview = overview + '.'
    var title_id = id.replace('desc', 'title')
    get_title(expcomp, title_id);
    $(id).html(overview);
}

function get_vardesc(varn, config, id){
        desc = "<strong>Displaying</strong> "+varn+": "+config[varn][0];
        if (varn == 'ttrend') {
            desc = desc + '<br><em>Note</em>: The reference for the temperature trend (ttrend) is taken from the first day (<b>20. Feb</b>) avg temp. in <b>nwp</b></p>';
        } else if (varn == 'net_surf_energy') {
            desc = desc + '<br><em>Note</emp>: Net surface energy = R<sub>net<sub>surf</sub></sub> + LH + SH';
        } else if (varn == 'cl') {
            desc = desc + '<br><em>Note</em>: Low-cloud cover has been calculated based on cloud water and ice within the lower 20 model level. The calculation might be subsect to improvements';
       } else{desc = desc + '<br>'}
      $(id).html(desc);
}

function  disp(fn, html_id){
    //$(".loader").fadeOut("slow");
    //$('.ext_obj').load(function() {
    //    $(".loader").fadeOut("slow");
    //});
    $.get(fn)
        .done(function() {
        // Do something now you know the image exists.
        $("#"+html_id).attr("data", fn);
    }).fail(function() { 
        // Image doesn't exist - do something else.
        $("#"+html_id).attr("data", 'media/test.html');
        $('.'+html_id).html('Comparison not Available')

    })
}


async function adisp(fn, html_id){
    await disp(fn, html_id);
}


function add_tab(label, disp_label, config, datasets, varnames, defaulttab, width, height){

    const data = "test.html";
    var alltabs = $('#alltabs');
    var tabhead = $('.tab');
    var expbtn_cls = 'expbtn_'+label;
    var varbtn_cls = 'varbtn_'+label;
    var apply_id = 'apply_'+label;
    var exp_desc_id = 'exp_desc_'+label;
    var var_desc_id = 'var_desc_'+label;
    var exp_title_id = 'exp_title_'+label;
    var map_id = 'map_img_'+label;
    var tab = '<fieldset> <legend>Experiement Control</legend><select class="'+expbtn_cls+'"></select><select class="'+varbtn_cls+'"></select><button id="'+apply_id+'">Show</button></fieldset><h4 id="'+exp_title_id+'">Test</h4><p id="'+exp_desc_id+'">This is a test</p><p id="'+var_desc_id+'">This is a test desc.</p>';
    var tab = tab +'<object clss="ext_obj" data="media/test.html" width="'+width+'" height="'+height+'" id="'+map_id+'">       Your browser doesn’t support the object tag. </object>';
    var div = '<div id="'+label+'", class="tabcontent">'+tab+'</div>';
    var onclick = "openTab(event, '"+label+"')";
    var button = '<button class="tablinks" onclick="'+onclick+'" '+defaulttab+'>'+disp_label+'</button>';
    alltabs.append(div);
    tabhead.append(button);
    var varbuttns = $('.'+varbtn_cls);
    var expbuttns = $('.'+expbtn_cls);

    $.each(varnames, function(num, vn){
        varbuttns.append(
            $('<option></option>').val(vn).html(vn)
        );
    });
    $.each(datasets, function(num, exp){
        expbuttns.append(
            $('<option></option>').val(exp).html(exp)
        );
    });
    var varn = $('.'+varbtn_cls).find("option:selected").val();
    var expname = $('.'+expbtn_cls).find("option:selected").val();
    get_vardesc(varn, config.variables.desc, '#'+var_desc_id);
    get_expdesc(expname, config, '#'+exp_desc_id);
    $("select."+varbtn_cls).change(function(){
        var varn = $(this).children("option:selected").val();
        get_vardesc(varn, config.variables.desc, '#'+var_desc_id);
    });
    $("select."+expbtn_cls).change(function(){
        var expname = $(this).children("option:selected").val();
        get_expdesc(expname, config, '#'+exp_desc_id);
    });
    $("#"+apply_id).on('click', function(){

        $.loader.open();
        var expcomp = $('.'+expbtn_cls).find("option:selected").val();
        var varn = $('.'+varbtn_cls).find("option:selected").val();
        var fn = 'media/'+label+'_'+expcomp+'_'+varn+'.html';
        adisp(fn, map_id);
        $.loader.close();
    });
    $('#'+apply_id).click();
    $('#defaultTab').trigger('click');
    $('#defaultTab').addClass('active');
}

function add_ts(prefix, suffixes, label, width, height){

    const data = "test.html";
    var div = $('#'+label);
    var selbtn_cls = 'selbtn_'+label;
    var apply_id = 'apply_'+label;
    var ts_id = 'ts_'+label
    var selbtn = '<fieldset><legend>Experiement Control</legend><select class="'+selbtn_cls+'"></select>'
    var showbtn =   '<button id="'+apply_id+'">Show</button></fieldset>';
    if (suffixes.length > 0){
        var obj = selbtn + showbtn;
    }else{
        var obj = showbtn;
    }
    var obj = obj + '<object data="media/test.html" width="'+width+'" height="'+height+'" id="'+ts_id+'">       Your browser doesn’t support the object tag. </object>';
    div.append(obj);
    var selbuttns = $('.'+selbtn_cls);

    $.each(suffixes, function(num, sfx){
        selbuttns.append(
            $('<option></option>').val(sfx).html(sfx)
        );
    });
    var sel = $('.'+selbtn_cls).find("option:selected").val();
    $("select."+selbtn_cls).change(function(){
        var sel = $(this).children("option:selected").val();
    });
    $("#"+apply_id).click(function(){
        var sel = $('.'+selbtn_cls).find("option:selected").val();
        if (sel === undefined) {
            var fn = 'media/'+prefix+'.html';
        }else{
            sel = sel.replace(' ', '_');
            var fn = 'media/'+prefix+'_'+sel+'.html';
        }
        disp(fn, ts_id);
    });
    $('#'+apply_id).click();
    if (suffixes.length == 0){
        $('#'+apply_id).prop("disabled",true);
    }

}

function add_overview(config, id){

    var table = $(id);
    overview_sect = ''
    for (i=0, l=config.datasets.length; i < l; i++){
        let key = config.datasets[i];
        let conf = config[key];
        let res = config.resolution[key];
        var row = `<tr><td><b>${key}</b></td><td>${conf} at ${res}</td></tr>`;
        $('#overview-table tr:last').after(row);
    }
}


$(document).ready(function(){
    var txt = '';
    var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
    reader.open("GET", 'simulations.json', false);
    reader.onloadend = json_parse;
    reader.send();
    function json_parse(){
        var txt = JSON.parse(reader.responseText);
        return txt
    }
    var config = json_parse();
    var datasets = config.overview.datasets;
    var varnames = config.variables.atm_varnames;
    var obs_vars = config.variables.obs_variables_2d;
    var obs_prefix = config.overview.obs_2d_name;
    add_overview(config.overview, '#overiew-table');
    $('.title').html(config.titles.long_title);
    $('.sub-title').html(config.titles.short_title);
    $('.page-title').html(config.titles.short_title);
    $('.time-period').html(config.titles.time_period[0]+' - '+config.titles.time_period[1]);
    datasets.sort();
    var comb = Combinatorics.combination(datasets, 2);
    var differences = [];
    while(a = comb.next()){
        differences.push(a[0]+'-'+a[1])
    }
    add_tab('absvalue', 'Absolute', config, datasets, varnames, 'id="defaultTab"', 800, 600);
    add_tab('diffvalue', 'Difference', config, differences, varnames, '', 800, 600);
    add_tab(obs_prefix, 'Observations', config, datasets, obs_vars, '', 800, 800);
    add_ts('zonal_avg', ['Land+Ocean', 'Ocean', 'Land'], 'zonal_avg', 850, 800);
    var region_names = [];
    for (i = 0, l = config.regions.display_regions.length; i<l; i++) {
        region = config.regions.display_regions[i];
        region_names.push(config.regions[region]['name']);
    }

    add_ts('time_series', region_names, 'time_series', 850, 600);
    add_ts('scatter', [], 'scatter', 850, 600);
    add_ts('vertical_profile', region_names, 'vertical_profile', 850, 600);

});

