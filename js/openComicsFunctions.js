/*
2012 - Comics Livres Plugin
Initial idea developed by Edson Garrido (edsongarrido(at)gmail.com)

Installation:
1. Upload folders images, comics, css and js to a server with public access
2. This script assumes that folders css, js, images and comics are all at the same level in the host site.
I.e.:
www.host.com/opencomics/js
www.host.com/opencomics/css
www.host.com/opencomics/comics
www.host.com/opencomics/images

Configuration:
1. In the document js/writeOpenComics.js, set the first line to the path where the 3 folders are in the site. Ie:
var source = 'http://www.host.com/opencomics' (dont type the last "/")

2. All the comics available by the plugin must be in the folder "comics" that we created.

3. Each comics must have an unique id that will be the name of the folder which will contain the comics jpg files.

4. (For now, this plugin just accept jpg files)

5. Dont use special characters neither spaces to name the comics id
(I.E.: ghost-corridors, ghost_corridors or ghostcorridors are valid names)

6. In the comics folder, will stay the available resolutions and their files 
(I.E.: ghost-corridors/1280/ or ghost-corridors/1024/ or ghost-corridors/800/ etc)

7. Inside the resolution folders, save each jpg file named always in pair and with numbers separated by a "-".
(I.E.: 1-2.jpg, 3-4.jpg, 5-6.jpg ans so on)

8. The script that will be released to inclusion in the page where the comics will show up must have 
the following structure:

<script 
	type="text/javascript" 
	src="http://www.host.com/opencomics/js/writeOpenComics.js?c=ghost-corridors;p=22" 
	id="open-comics-source">
</script>
Where: 
- www.host.com/opencomics is the site and path where are the plugin and the comics
- /js/ is the folder where are the plugin javascripts
- writeOpenComics.js is the file that set variable 'source' with the host address
- c=ghost-corridors is the folder id where is the comics called by the plugin
- p=22 is the comics total number of pages 

Implementation:
1. Deliver the generated code to the ones interested to display the comics. The user must paste this code
at the place where would like the open comics button to appear.

*/

jQuery.noConflict();
     
 jQuery(document).ready(function($){
   
   $('#open-comics-source').after('<button id="open-comics-reader">COMICS LIVRES</button>');
   $('#open-comics-source').after('<div id="open-comics-loader"></div>');

   var folder = $("#open-comics-source").attr('src').match("c=(.*);r"); //folder[1]
   var res    = $("#open-comics-source").attr('src').match("r=(.*);p"); //res[1]
   var pages  = $("#open-comics-source").attr('src').match("p=(.*)");   //pages[1]
   
   var totalPages = pages[1];
   
   $('button#open-comics-reader').live({
   		click: function(){
   		
   			$("#open-comics-loader").html(getMyOpenComics(folder, res, pages)).dialog({
				width: '99%',
				/*height: 620,*/
				modal: true,
				resizable: false,
				zIndex: 1,
				title: 'OPEN COMICS',
				show: 'fade',
				hide: 'fade'
			});
   			$(".ui-dialog-titlebar").hide();
			$('.ui-dialog a').blur();
			loadFirstPage(folder[1], res[1]);
   		}
   
   });
   
	$('div.right a').live({
		click: function(){
			 var scrollLeft = parseInt($('div.scroll-content').css('left'))*-1;
			 var max = totalPages * 40;
			 if(scrollLeft < max) {
			 	$('div.scroll-content').animate({
			    	left: '-=100'
			  	}, 2000, function() {
			    
			  		});
			 } 
		}	
	});
	
	$('div.left a').live({
		click: function(){
			 var scrollLeft = parseInt($('div.scroll-content').css('left'));
			 if(scrollLeft < 0) {
			 	  $('div.scroll-content').animate({
			    	left: '+=100'
				  }, 2000, function() {
				    
				  });	
			 }
		}	
	});
	
   $("div.scroll-content-item a").live({
   		click: function() {
			var text = $(this).text();
			loadNextPage(text, folder, res);
		}
   });
   
   /* 37-left / 39-right arrow keys */
   $(document).keydown(function(e){
	   if (e.keyCode == 39) { 
		   var text = $("div.reading-page").next("div").text();
		   if(text.length){
			   loadNextPage(text, folder, res);
		   }
	   }
	   if (e.keyCode == 37) { 
		   var text = $("div.reading-page").prev("div").text();
		   if(text.length){
			   loadNextPage(text, folder, res);   
		   }
	   }
	});

   
   $("div#open-comics-close a").live({
   		click: function() {
			$('div#open-comics-loader').dialog('close');
		}
   });
   
 });
 
 
 function loadNextPage(text, folder, res) {
	 
	 jQuery("div.scroll-content-item").each(function(){
		if(jQuery(this).text() == text) {
			jQuery(this).html(text);
			jQuery(this).addClass('reading-page');
		} else {
			mytext = jQuery(this).text();
			jQuery(this).removeClass('reading-page');
			jQuery(this).html('<a href="javascript:void(0);">'+mytext+'</a>');
		}
	});
	
	jQuery("#open-comics-page-container").html('<img src="'+source+'/images/ajax-loader.gif" id="open-comics-loader" />');	

	var pages = text.replace(/\//, '-');
	var file = source+'/comics/'+folder[1]+'/'+res[1]+'/'+pages+'.jpg';
	jQuery("#hidden-loader").html('<img src="'+file+'" />');
	jQuery("#hidden-loader img").load(function(){
		var img = jQuery("#hidden-loader").html();
		jQuery("#open-comics-page-container").html(img);
		jQuery("#open-comics-page-container img").fadeIn('slow');
	});
	 
 }
 
 function getMyOpenComics(folder, res, pages) {
	
	var loops = Math.ceil(parseInt(pages[1]));
	
	var div = '';
	div += '<div id="open-comics-wrapper">';
	div += '<div id="open-comics-close"><a href="javascript:void(0);">X</a></div>';
	div += '<div id="open-comics-page-container">';
	div += '<img src="'+source+'/comics/" />';
	div += '</div>';
	div += '<div id="open-comics-scroller">';
	div += '<div class="scroll-nav left"><a href="javascript:void(0);"><img src="'+source+'/images/prev-ico.png" /></a></div>';
	div += '<div class="scroll-pane ui-widget ui-widget-header ui-corner-all">';
	div += '<div class="scroll-content">';
	
	for (i = 1; i <= loops; i++) {
		if(i%2) {
			next = i+1;
			pageStr = i + '/' + next;
			/* Use the following variable (pageImg) if you chose to use an image to page numbers
			 * Script assumes the images are named 1-2.png 3-4.png 5-6.png etc
			 * Save these images inside 'images' folder of your open comics repository
			 * Replace variable pageStr with pageImg at div line bellow  */
			pageImg = '<img src="'+source+'/comics-livres/images/'+ i + '-' + next + '.png" />';
			div += '<div class="scroll-content-item ui-widget-header"><a href="javascript:void(0);">'+ pageStr + '</a></div>';
		}
	}
	
	div += '</div>';
	div += '</div>';
	div += '<div class="scroll-nav right"><a href="javascript:void(0);"><img src="'+source+'/images/next-ico.png" /></a></div>';
	div += '</div>';
	div += '<input type="hidden" name="page" value="1" />';
	div += '<div id="hidden-loader"></div>';
	div += '</div>';
	
	return div;
	
 }
 
 function loadFirstPage(folder, res) {
 	
	jQuery(document).ready(function($){
	
		$("#open-comics-page-container").html('<img src="'+source+'/images/ajax-loader.gif" id="open-comics-loader" />');	
	
		var file = source+'/comics/'+folder+'/'+res+'/1-2.jpg';
		$("#hidden-loader").html('<img src="'+file+'" />');
	
		$("#hidden-loader img").load(function(){
			var img = $("#hidden-loader").html();
			$("#open-comics-page-container").html(img);
			$("#open-comics-page-container img").fadeIn('slow');
		});
		var mytext = $("div.scroll-content-item:first-child").text();
		//alert($("div.scroll-content-item:first-child").text());
		$("div.scroll-content-item:first-child").html(mytext);
		$("div.scroll-content-item:first-child").addClass('reading-page');
	
	});
	
	
 }
