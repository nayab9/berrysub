var configServer = "";
var configPort = "";
var configUsername = "";
var configPassword = "";
var configURL = "";
var standard = "&v=1.7.0&c=sl&f=jsonp";

// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) {

	// We only want to handle changePage() calls where the caller is
	// asking us to load a page by URL.
	if ( typeof data.toPage === "string" ) {

			var populated = false;
			var viewer = false;
			var mediaid = "";
			
			datanull = [];
			// We're being asked to display the items for a specific category.
			// Call our internal method that builds the content for the category
			// on the fly based on our in-memory category data structure.
			var u = $.mobile.path.parseUrl( data.toPage ),
			re = /^#/;

			//instea dof populate page, clal ajax on the folder
			//populatePage(u, data);
			
			var pageFinder = u.hash.replace( /\?.*$/, "" );
			//var fromPage = from.hash.replace( /\?.*$/, "" );
			
			if (pageFinder.indexOf("sub") >= 0)
			{
				pageFinder = pageFinder.substring(4);
				pageFinder = "#" + pageFinder;
			}
			else if (pageFinder.indexOf("view") >= 0)
			{
				mediaid = pageFinder.substring(5);
				pageFinder = "#viewer";
				viewer = true;
			}
			else if (pageFinder.indexOf("download.view") >= 0 ||
				 pageFinder.indexOf("ping.view") >= 0 )
			{
				pageFinder = "no";
			}
	
			var liFinder = pageFinder + " li";
			//var $page = $( "#blarg" );
			var pageHash = "#" + u;
			
			if ( pageFinder == "no" || pageFinder == "")
			{
				
				
			}
			else if ( $(pageFinder).length )
			{
			//{	
			//	var wtf = $(liFinder);
				populated = true;

			}
			//	if ($(liFinder).has('li'))
			//	{
			//		pageid = pageFinder.substring(1);	
			//		populated = true;
			//	}
			//	else
			//	{
			//		requestIndex(u, data.options);
			//	}
				//populatePage(pageid, datanull, data.options)
				
			//}
			else
			{
				requestIndex(u, data.options);
			}
			//ajax complete will call populate page.
			

			// Make sure to tell changePage() we've handled this call so it doesn't
			// have to do anything.
			e.preventDefault();
			
			if (populated)
			{
				if (viewer)
				{
					preparePlayer(mediaid, data.options);
					var $page = $( pageFinder  );
					$.mobile.changePage( $page, { transition: "flip"} );
				}
				else
				{
					if (data.options.fromPage.selector.indexOf("#viewer") >= 0)
					{				
						var $page = $( pageFinder  );
						$.mobile.changePage( $page, { transition: "flip"} );
					}
					else
					{
						var $page = $( pageFinder  );
						$.mobile.changePage( $page );
					}
				}
				
				
			}
		
	}
	else
	{
	
	}
});

function preparePlayer(id, options)
{
	
	var stream = "rest/stream.view?";
	

	configServer = $("#server").val();
	configPort = $("#port").val();
	configUsername = $("#username").val();
	configPassword = $("#password").val();
	
	if ( configServer.substr(configServer.length-1) != '/' )
	{
		configServer = configServer + ":" + configPort + '/';
	}
	else
	{
		configServer.replace("/", "");
		configServer = configServer + ":" + configPort + '/';
	}
	
        var streamURL = configServer + stream + "&u=" + configUsername + "&p=" + configPassword + standard + "&id=";
	var pageHash = "#viewer";
	var viewerBack = "#viewerBack";

	//$('#mediaDiv').css({top:'50%',left:'50%',margin:'-'+($('#mediaDiv').height() / 2)+'px 0 0 -'+($('#mediaDiv').width() / 2)+'px'});
	
	var from = "#homePage";
	if (options.fromPage != undefined)
	{
		if (options.fromPage.selector.indexOf("#") >= 0)
		{
			from = options.fromPage.selector;
		}
	}


	var $page = $( pageHash ),

		// Get the header for the page.
		$header = $page.children( ":jqmData(role=header)" );
	
		var fromTextFinder = "#view" + id;
		
		var headerName = $(fromTextFinder).attr("name");
			
		$header.find( "h1" ).html( headerName );

		$(viewerBack).attr("href", from);
		
		$page.page();	
	
	streamURL = streamURL + id;
	
	jwplayer('mediaplayer').setup({
	       'flashplayer': 'jwplayer/player.swf',
	       'width': '480',
	       'height': '270',
	       'controlbar': 'bottom',
	       'stretching': 'exactfit',
	       'file': streamURL,
	       'provider': 'video',
	       'autostart': true
	 });
	 
}

function testConnection()
{
    $(document).ready(function () {
	
	$("ul#list").empty();
	
	var ping = "rest/ping.view?";
	var topFolders = "rest/getMusicFolders.view?";
	
	configServer = $("#server").val();
	configPort = $("#port").val();
	configUsername = $("#username").val();
	configPassword = $("#password").val();
	
	if ( configServer.substr(configServer.length-1) != '/' )
	{
		configServer = configServer + ":" + configPort + '/';
	}
	else
	{
		configServer.replace("/", "");
		configServer = configServer + ":" + configPort + '/';
	}
	
        var pingURL = configServer + ping + "&u=" + configUsername + "&p=" + configPassword + standard;
	
        $.ajax({
            url: pingURL,
            method: 'GET',
            dataType: 'jsonp',
            timeout: 10000,
	    beforeSend: function () { $.mobile.showPageLoadingMsg();  },
	cache: false,
	complete: function() { console.log("Complete!"); $.mobile.hidePageLoadingMsg();  },
            done: function () {  console.log("DONE!");  },
            error: function (x, t, m) 
			{  
				if (t==="timeout") 
				{ 
					console.log("TIMEOUT!");
				}
				
				if (x.status == 500)
				{
					console.log("Server Error");
				}
				
			$(".buttonTest").siblings('.ui-btn-inner').children('.ui-btn-text').text("Error!").css("color", "red");
			
			},
            success: function (data) {
                console.log("SUCCESS");
                if (data["subsonic-response"].status === 'ok') {
			$(".buttonTest").siblings('.ui-btn-inner').children('.ui-btn-text').text("Success!").css("color", "green");
			
			amplify.store( "configServer", $("#server").val() );
			amplify.store( "configPort", configPort );
			amplify.store( "configUsername", configUsername );
			amplify.store( "configPassword", configPassword );

			appendage();
				
                } else {
                    var error = data["subsonic-response"].status;
                    var errorcode = data["subsonic-response"].error.code;
                    var errormsg = data["subsonic-response"].error.message;
		    $(".buttonTest").siblings('.ui-btn-inner').children('.ui-btn-text').text('Error Status: ' + error + ', Code: ' + errorcode + ', Message: ' + errormsg).css("color", "red");
                    //var errorhtml = '<li class=\"item\"><span>' + error + '</span></li>';
                    //$(errorhtml).appendTo("#IndexList");
                }
            }
        });
    });
}

function appendage()
{
	
    $(document).ready(function () {

	$("ul#list").empty();

	var topFolders = "rest/getMusicFolders.view?";
	
	configServer = $("#server").val();
	configPort = $("#port").val();
	configUsername = $("#username").val();
	configPassword = $("#password").val();
	
	if ( configServer.substr(configServer.length-1) != '/' )
	{
		configServer = configServer + ":" + configPort + '/';
	}
	else
	{
		configServer.replace("/", "");
		configServer = configServer + ":" + configPort + '/';
	}
	
        var topURL = configServer + topFolders + "&u=" + configUsername + "&p=" + configPassword + standard;
	
        $.ajax({
            url: topURL,
            method: 'GET',
            dataType: 'jsonp',
            timeout: 10000,
	     beforeSend: function () { $.mobile.showPageLoadingMsg();  },
	cache: false,
	complete: function() { console.log("Complete!"); $.mobile.hidePageLoadingMsg();  },
            done: function () {  console.log("DONE!");  },
            error: function (x, t, m) 
			{  
				if (t==="timeout") 
				{ 
					console.log("TIMEOUT!");
				}
				
				if (x.status == 500)
				{
					console.log("Server Error");
				}

			},
            success: function (data) {
                console.log("SUCCESS");
                if (data["subsonic-response"].status === 'ok') {
                    var indexlist, indexname;

                    if (data["subsonic-response"].version != '') {
                        version = data["subsonic-response"].version;
                    }
                    var folders = [];
                    if (data["subsonic-response"].musicFolders.musicFolder.length > 0) {
                        folders = data["subsonic-response"].musicFolders.musicFolder;
                    } else {
                        folders[0] = data["subsonic-response"].musicFolders.musicFolder;
                    }
					
					
                    // There is a bug in the API that doesn't return a JSON array for one artist
 /*                    $.each(folders, function(i,folder){
                        var folderid = "\"" + folder.id + "\"";
                        var passid = folder.id;
                        url = "http://nayab9.subsonic.org/rest/getIndexes.view?u=admin&p=ggh4x0rz&v=1.7.0&c=sl&f=jsonp&musicFolderId=";// + folder.id;
						
						$("ul#list").append('<li id=' + folderid + '> <a href="#">' + folder.name + '</a></li>').listview("refresh");
                        
						var temp2 = "#" + passid;

						// $(temp2).click(function(){ launchAjax(passid, url); });
						
                        
                    }); 
				
					
					var i = 0;
					launchAjax(folders, url, i);
					//launchAjax2(folders, url, i);
				*/	
				
					
                    // There is a bug in the API that doesn't return a JSON array for one artist
                     $.each(folders, function(i,folder){
                        var folderid =  folder.id;
                        var passid = folder.id;
                        var selector = "#" + folder.id;
						
						
						
						
						//<div data-role="content">	
						
						//<ul data-role="listview" data-inset="true" data-filter="true" id="list">

						
						// <ul data-role="listview" data-inset="true" data-filter="true" id="' + folder.id +'"> </ul>
						
						
						//$('body').append('<div data-role="page" id="' + folder.id + '"> <div data-role="header"> <a href="#homePage">Back</a> <h1></h1> </div> <div data-role="content"> </div> </div>');//.trigger('create');
						
						
						$("ul#list").append("<li id='sub" + folderid + "'> <a href='#" + folder.id + "'>" + folder.name + "</a></li>").listview("refresh");
                        
						//var temp2 = "#" + passid;

						// $(temp2).click(function(){ launchAjax(passid, url); });
						
                        
                    }); 
				
					
//					var i = 0;
//					launchAjax(folders, url, i);
					//launchAjax2(folders, url, i);
									
				
				
                } else {
                    var error = data["subsonic-response"].status;
                    var errorcode = data["subsonic-response"].error.code;
                    var errormsg = data["subsonic-response"].error.message;
		    console.log('Status: ' + error + ', Code: ' + errorcode + ', Message: ' + errormsg);
                    //alert('Status: ' + error + ', Code: ' + errorcode + ', Message: ' + errormsg);
                    //var errorhtml = '<li class=\"item\"><span>' + error + '</span></li>';
                    //$(errorhtml).appendTo("#IndexList");
                }
            }
        });
    });
}

function populatePage(pageid, data, options)
{
	var download = "rest/download.view?";
	
	configServer = $("#server").val();
	configPort = $("#port").val();
	configUsername = $("#username").val();
	configPassword = $("#password").val();
	
	if ( configServer.substr(configServer.length-1) != '/' )
	{
		configServer = configServer + ":" + configPort + '/';
	}
	else
	{
		configServer.replace("/", "");
		configServer = configServer + ":" + configPort + '/';
	}
	
        var downloadURL = configServer + download + "&u=" + configUsername + "&p=" + configPassword + standard + "&id=";
	//var pageSelector = "$#" + pageid;
	var pageHash = "#" + pageid;
	
	var indexes = []; //main index when getIndexes is called
	var child = []; //child is array of actual files
	var childCount = 0;
	var index = []; //holds artist subfolders
	var indexCount = 0;
	var artists = []; //artist subfolders form getINdex
	var artistsCount = 0;
	
	var directory = []; //from a get artist id call
	var dirChild = []; //actual files from the subdirectory
	var dirChildCount = 0;
	
	if (data != undefined)
	{
		if (data["subsonic-response"].indexes != undefined)
		{
			if (data["subsonic-response"].indexes.child != undefined)
			{
				if (data["subsonic-response"].indexes.child.length > 0)
				{
					child = data["subsonic-response"].indexes.child;
				}
				else 
				{
					child[0] = data["subsonic-response"].indexes.child;
				}
				
				childCount = child.length;

			}
			
			if (data["subsonic-response"].indexes.index != undefined)
			{
				if (data["subsonic-response"].indexes.index.length > 0)
				{
					index = data["subsonic-response"].indexes.index;
				}
				else 
				{
					index[0] = data["subsonic-response"].indexes.index;
				}
				
				indexCount = index.length;

			}	
		}
		
		if (data["subsonic-response"].directory != undefined)
		{
			if (data["subsonic-response"].directory.child != undefined)
			{
				if (data["subsonic-response"].directory.child.length > 0)
				{
					dirChild = data["subsonic-response"].directory.child;
				}
				else 
				{
					dirChild[0] = data["subsonic-response"].directory.child;
				}
				
				dirChildCount = dirChild.length;

			}
			
			//neeed a case for directories inside subdirectories.
	/* 		if (data["subsonic-response"].indexes.index != undefined)
			{
				if (data["subsonic-response"].indexes.index.length > 0)
				{
					index = data["subsonic-response"].indexes.index;
				}
				else 
				{
					index[0] = data["subsonic-response"].indexes.index;
				}

			}	 */
		}	
	}
	
	var from = "#homePage";
	if (options.fromPage != undefined)
	{
		if (options.fromPage.selector.indexOf("#") >= 0)
		{
			from = options.fromPage.selector;
		}
	}
	
	$('body').append('<div data-role="page" id="' + pageid + '" data-theme="a" data-content-theme="a"> <div data-role="header"> <a href="' + from + '" data-icon="arrow-u"  data-iconpos="notext">Up</a> <a href="#homePage" class="ui-btn-right" data-icon="home" data-theme="a" data-iconpos="notext">Home</a> <h1></h1> </div> <div data-role="content"> </div> </div>');
	
	var $page = $( pageHash ),

			// Get the header for the page.
			$header = $page.children( ":jqmData(role=header)" ),

			// Get the content area element for the page.
			$content = $page.children( ":jqmData(role=content)" ),

			// The markup we are going to inject into the content
			// area of the page.
			markup = "<ul data-role='listview' data-inset='true' data-filter='true'>";
	
			//attach ANY folders/subfolders FIRST
			for ( var i = 0; i < indexCount; i++ ) 
			{
				for ( var j = 0; j < index[i].artist.length; j++ )
				{
					markup += "<li id='sub" + index[i].artist[j].id + "'> <a href='#sub"
						+ index[i].artist[j].id + "' > <img src='images/folder.png'/>" + index[i].artist[j].name + " </a> </li>";
					
					//$('body').append('<div data-role="page" id="' + index[i].artist[j].id + '"> <div data-role="header"> <a href="' + pageHash + '">Back</a><h1></h1> </div> <div data-role="content"> </div> </div>');
				}
			}				
			
			// throw in media files from getIndexes
			for ( var i = 0; i < childCount; i++ ) {
				if (child[i].contentType.indexOf("audio") < 0 )
				{
					markup += "<li id='" + child[i].id + "'> <img src='images/video.png'/>"
						+ child[i].title + " <div data-role='controlgroup' data-type='horizontal' align='right'> <a id='view"
						+ child[i].id + "' href='#view" + child[i].id
						+ "' data-transition='flip' data-role='button' data-icon='arrow-r' name='" + child[i].title + "'> Play </a> <a href='"
						+ downloadURL + child[i].id + "' data-role='button' data-icon='arrow-d' >Download </a> </div> </li>";
				}
			}
			
			//media files from subdirecotires
			for ( var i = 0; i < dirChildCount; i++ ) {
			
				if (dirChild[i].isDir)
				{					
					markup += "<li id='sub" + dirChild[i].id + "'> <a href='#sub" + dirChild[i].id + "' > <img src='images/folder.png'/>" + dirChild[i].title + " </a></li>";
				}
				else if ( dirChild[i].contentType.indexOf("audio") < 0 )
				{										   
					markup += "<li id='" + dirChild[i].id + "'> <img src='images/video.png'/>" + dirChild[i].title
						+ " <div data-role='controlgroup' data-type='horizontal' align='right'> <a id='view" + dirChild[i].id
						+  "' href='#view" + dirChild[i].id + "' data-transition='flip' data-role='button' data-icon='arrow-r' name='" + dirChild[i].title + "'> Play </a> <a href='"
						+ downloadURL + dirChild[i].id + "' data-role='button' data-icon='arrow-d'> Download </a> </div> </li>";
				}
			}			
					
			markup += "</ul>";

			// Find the h1 element in our header and inject the name of
			// the category into it.
			
			//fromTextFinder = from.substring(1);
			//fromTextFinder = "sub" + fromTextFinder;
			//fromTextFinder = "#" + fromTextFinder;
			fromTextFinder = "#sub" + pageid;
			
			var headerName = $(fromTextFinder).text();
			
			
			$header.find( "h1" ).html( headerName );

			//MARKUP IS NOT BEING INJECTED!!!
			
			// Inject the category items markup into the content element.
			$content.html( markup );
			
			//$(pageHash).children().eq(1).append(markup);
			
			// Pages are lazily enhanced. We call page() on the page
			// element to make sure it is always enhanced before we
			// attempt to enhance the listview markup we just injected.
			// Subsequent calls to page() are ignored since a page/widget
			// can only be enhanced once.
			$page.page();

			// Enhance the listview we just injected.
			$content.find( ":jqmData(role=listview)" ).listview();

			// We don't want the data-url of the page we just modified
			// to be the url that shows up in the browser's location field,
			// so set the dataUrl option to the URL for the category
			// we just loaded.
			
			options.dataUrl = pageHash;

			// Now call changePage() and tell it to switch to
			// the page we just modified.
			$.mobile.changePage( $page , options );
		
	//$(pageSelector).append('<ul data-role="listview" data-inset="true" id="derp"> <li id="harp"> blah </li></ul>');

}
function requestIndex(u, options)
{
	var download = "rest/download.view?";
	var musicDir = "rest/getMusicDirectory.view?";
	var getIndexes = "rest/getIndexes.view?";
	
	configServer = $("#server").val();
	configPort = $("#port").val();
	configUsername = $("#username").val();
	configPassword = $("#password").val();
	
	if ( configServer.substr(configServer.length-1) != '/' )
	{
		configServer = configServer + ":" + configPort + '/';
	}
	else
	{
		configServer.replace("/", "");
		configServer = configServer + ":" + configPort + '/';
	}
	
        var downloadURL = configServer + download + "&u=" + configUsername + "&p=" + configPassword + standard + "&id=";
	var musicDirURL = configServer + musicDir + "&u=" + configUsername + "&p=" + configPassword + standard + "&id=";
	var indexURL = configServer + getIndexes + "&u=" + configUsername + "&p=" + configPassword + standard + "&musicFolderId=";
	
	var populateURL = "";
	
		var pageSelector = u.hash.replace( /\?.*$/, "" );
		var pageid = "";
		var type = "";
		
		if (pageSelector.indexOf("sub") >= 0)
		{
			type = "sub";
			pageid = pageSelector.substring(4);
		}
		else if (pageSelector.indexOf("down") >= 0)
		{
			type = "down";
			pageid = pageSelector.substring(5);
		}
		else
		{
			pageid = pageSelector.substring(1);
		}
	
		pageSelector = "#" + pageid;
		
		if (type == "sub")
		{
			populateURL =  musicDirURL;			
		}
		else if (type == "down")
		{
			populateURL = downloadURL;	
		}
		else
		{
			populateURL = indexURL;
		}
		
		populateURL = populateURL + pageid;
		
		$.ajax({
			url: populateURL,
			method: 'GET',
			context: pageid,
			context: options,
			context: type,
			dataType: 'jsonp',
			cache: false,
			timeout: 10000,
			beforeSend: function () { $.mobile.showPageLoadingMsg();  },
			done: function () {  console.log("DONE!");  },
			complete: function() { console.log("Complete!"); $.mobile.hidePageLoadingMsg();  },
			error: function (x, t, m) 
			{  
				if (t==="timeout") 
				{ 
					console.log("TIMEOUT!");
				}
				
				if (x.status == 500)
				{
					console.log("Server Error");
				}

			},    
			success: function (data) {
				console.log("SUCCESS");
				if (type != "down")
				{
					if (data["subsonic-response"].status === 'ok') {
						var indexlist, indexname;
						
						if (data["subsonic-response"].version != '') {
							version = data["subsonic-response"].version;
						}
						
						//$('body').append('<div data-role="page" id="' + pageid + '"> <div data-role="header"> <h1></h1> </div> <div data-role="content"> </div> </div>');
	
							populatePage(pageid, data, options);
						
						
					} else {
						var error = data["subsonic-response"].status;
						var errorcode = data["subsonic-response"].error.code;
						var errormsg = data["subsonic-response"].error.message;
						alert('Status: ' + error + ', Code: ' + errorcode + ', Message: ' + errormsg);
						//var errorhtml = '<li class=\"item\"><span>' + error + '</span></li>';
						//$(errorhtml).appendTo("#IndexList");
					}
				}
			}
		});			
}